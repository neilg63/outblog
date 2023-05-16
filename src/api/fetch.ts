import { perPage, wpApiUri } from "./settings";
import { notEmptyString, renderDateRange } from "./utils";
import { ParamSet, Post, Tag } from "./models";

const mapToPost = (resource: ParamSet, tags: Tag[] = []): Post => {
  return new Post(resource, tags);
};

const mapToPlainPost = (resource: ParamSet): Post => {
  return new Post(resource, []);
};

const mapToTag = (resource: ParamSet): Tag => {
  return new Tag(resource);
};

const buildQueryString = (params: ParamSet): string => {
  const parts = Object.entries(params)
    .filter((entry) => {
      return entry[1] !== null && entry[1] !== undefined;
    })
    .map(([key, value]) => {
      return `${key}=${value}`;
    });
  return parts.length > 0 ? "?" + parts.join("&") : "";
};

export const fetchContent = async (
  method: string,
  params: ParamSet
): Promise<any> => {
  const qStr = buildQueryString(params);
  const uri = wpApiUri(method + qStr);
  const response = await fetch(uri);
  return await response.json();
};

export const fetchContentPlain = async (
  method: string,
  params: ParamSet
): Promise<any> => {
  return await fetchContent(method, {});
};

export const fetchTopPosts = async (
  start = 0,
  perPage = 32,
  year = 0,
  month = 0,
  tag = 0
): Promise<Post[]> => {
  const page = start / perPage + 1;
  const monthFilter = renderDateRange(year, month);
  const params: ParamSet = {
    page,
    per_page: perPage,
    _fields: "id,date,slug,title,link,excerpt,tags,featured_media,featured_img",
  };
  if (monthFilter.apply) {
    params.per_page = 100;
    params.before = monthFilter.before;
    params.after = monthFilter.after;
  }
  if (tag > 0) {
    params.tags = tag;
  }
  const data = await fetchContent("posts", params);
  const tags = await fetchTags();
  return data instanceof Array ? data.map((row) => mapToPost(row, tags)) : [];
};

export const fetchPost = async (slug = ""): Promise<Post> => {
  const page = 1;
  const params: ParamSet = {
    page,
    per_page: 4,
    slug,
  };
  const data = await fetchContent("posts", params);
  const items =
    data instanceof Array
      ? data.map(mapToPlainPost).filter((post) => post.isValid())
      : [];
  return items.length > 0 ? items[0] : new Post(null);
};

export const fetchPages = async (
  slug = "about",
  start = 0,
  perPage = 32
): Promise<Post[]> => {
  const page = start * perPage + 1;
  const params: ParamSet = {
    page,
    per_page: perPage,
  };
  if (notEmptyString(slug, 3)) {
    params.slug = slug;
  }
  const data = await fetchContent("pages", params);
  return data instanceof Array
    ? data.map(mapToPlainPost).filter((post) => post.isValid())
    : [];
};

export const fetchPage = async (slug = "about"): Promise<Post> => {
  const data = await fetchPages(slug, 0, 4);
  const items =
    data instanceof Array
      ? data.map(mapToPlainPost).filter((post) => post.isValid())
      : [];
  if (items.length > 0) {
    return items[0];
  } else {
    return new Post(null);
  }
};

export const fetchTags = async (
  start = 0,
  perPage = 100,
  search = ""
): Promise<Tag[]> => {
  const page = start * perPage + 1;
  const params: ParamSet = {
    page,
    per_page: perPage,
    _fields: "id,name,slug,count,taxonomy",
  };
  if (notEmptyString(search)) {
    params.search = search;
  }
  const data = await fetchContent("tags", params);
  return data instanceof Array
    ? data.map(mapToTag).filter((tg) => tg.isValid())
    : [];
};

export const matchTag = async (search = ""): Promise<Tag> => {
  const tags = await fetchTags(0, 20, search);
  const rgx = new RegExp("^" + search.replace(/[^a-z0-9]/, ".*?") + "$", "");
  const suggested = tags.find((tag) => tag.slug === search);
  return suggested instanceof Tag ? suggested : new Tag(null);
};

export const fetchByTag = async (slug = ""): Promise<Post[]> => {
  const tag = await matchTag(slug);
  const posts = tag.isValid()
    ? await fetchTopPosts(0, perPage, 0, 0, tag.id)
    : [];
  return posts.map((post) => post.addMainTag(tag));
};
