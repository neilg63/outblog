import {
  API_URI,
  defImages,
  imgBase,
  siteDesc,
  siteTitle,
  urlSplit,
} from "./settings";
import {
  cleanText,
  correctHtml,
  extractExcerpt,
  extractRendered,
  formatDate,
  isObjectWithObject,
  isObjectWithString,
  notEmptyString,
  stripHtml,
  validISODateString,
} from "./utils";

export interface ParamSet {
  [key: string]: any;
}

type BasePost = { title: string; excerpt: string; slug: string; uri: string };

export class PostPreview implements BasePost {
  title = "";
  slug = "";
  uri = "";
  excerpt = "";
  date = new Date(0);
  mode = 1;

  constructor(mode = 1, resource: any = null) {
    if (resource instanceof Object) {
      this.title = cleanText(resource.title);
      if (typeof resource.uri === "string") {
        const full_slug = resource.uri.split(urlSplit()).pop();
        if (typeof full_slug === "string") {
          this.uri = full_slug;
        }
      }
      if (typeof resource.slug === "string") {
        this.slug = resource.slug;
      }
      this.excerpt = notEmptyString(resource.excerpt) ? resource.excerpt : "";
      if (validISODateString(resource.date)) {
        this.date = new Date(resource.date);
      }
    }
  }

  get isNext() {
    return this.mode === 1;
  }

  get isPrev() {
    return this.mode === -1;
  }

  isValid() {
    return (
      this.date.getFullYear() > 1980 &&
      notEmptyString(this.uri, 3) &&
      notEmptyString(this.title)
    );
  }
}

export class MetaTagSet {
  title = "";
  description = "";
  image = "";

  constructor(obj: Post | any) {
    if (obj instanceof Post) {
      this.title = [siteTitle, obj.title].join(": ");
      this.description = stripHtml(obj.excerpt);
      this.image = obj.previewImg;
    } else if (obj instanceof Object) {
      Object.entries(obj).forEach(([k, v]) => {
        if (typeof v === "string") {
          switch (k) {
            case "title":
            case "image":
              this[k] = v;
              break;
            case "description":
              this[k] = stripHtml(v);
              break;
          }
        }
      });
      if (this.title.length < 2) {
        this.title = siteTitle;
      }
      if (this.description.length < 2) {
        this.description = siteDesc;
      }
    }
  }

  fromPost(obj: Post) {
    this.title = [siteTitle, obj.title].join(": ");
    this.description = obj.excerpt;
    this.image = obj.previewImg;
  }

  get pageTitle(): string {
    const title = this.title.split(": ").pop();
    if (typeof title === "string") {
      return title;
    } else {
      return siteTitle;
    }
  }
}

export interface ImgSize {
  width: number;
  height: number;
}

export class Post implements BasePost {
  title = "";
  content = "";
  uri = "";
  slug = "";
  excerpt = "";
  previewImg = "";
  previewSize: ImgSize = { width: 0, height: 0 };
  date: Date = new Date(0);
  modified: Date = new Date(0);
  tags: Tag[] = [];
  mainTag: Tag = new Tag();
  next = new PostPreview();
  prev = new PostPreview();

  constructor(resource: any = null, tags: Tag[] = []) {
    if (resource instanceof Object) {
      this.title = cleanText(extractRendered(resource, "title"));
      if (typeof resource.link === "string") {
        const full_slug = resource.link.split(urlSplit()).pop();
        if (typeof full_slug === "string") {
          this.uri = full_slug;
        }
      }
      if (typeof resource.slug === "string") {
        this.slug = resource.slug;
      }
      this.content = correctHtml(extractRendered(resource, "content"));
      this.excerpt = extractExcerpt(resource);
      if (resource.date) {
        this.date = new Date(resource.date);
      }
      if (resource.modified) {
        this.modified = new Date(resource.modified);
      }
      if (isObjectWithString(resource.preview_img, "src")) {
        const { width, height, src } = resource.preview_img;
        this.previewImg = src;
        if (width > 0 && height > 0) {
          this.previewSize = { width, height };
        }
      } else if (notEmptyString(resource.featured_img, 7)) {
        this.previewImg = resource.featured_img;
      }
      if (resource.tags instanceof Array && tags instanceof Array) {
        this.tags = resource.tags
          .map((tagId: number) => {
            const tg = tags.find((t) => t.id === tagId);
            return tg instanceof Tag ? tg : new Tag(null);
          })
          .filter((t: Tag) => t.isValid());
      }
      if (isObjectWithObject(resource.adjacent, "next")) {
        if (resource.adjacent.next.id > 0) {
          this.next = new PostPreview(1, resource.adjacent.next);
        } else if (this.next.isValid()) {
          this.next = new PostPreview(1, null);
        }
      }
      if (isObjectWithObject(resource.adjacent, "prev")) {
        if (resource.adjacent.prev.id > 0) {
          this.prev = new PostPreview(-1, resource.adjacent.prev);
        }
      }
    }
  }

  meta(): MetaTagSet {
    return new MetaTagSet(this);
  }

  isValid() {
    return (
      this.date.getFullYear() > 2000 &&
      notEmptyString(this.title) &&
      notEmptyString(this.slug)
    );
  }

  addMainTag(tg: Tag): Post {
    this.mainTag = tg;
    return this;
  }

  dateFormat(mode = "short"): string {
    return formatDate(this.date, mode);
  }

  get shortDate(): string {
    return this.dateFormat("short");
  }

  get mediumDate(): string {
    return this.dateFormat("medium");
  }

  get longDate(): string {
    return this.dateFormat("long");
  }

  get tagList() {
    return this.tags
      .filter((tg: Tag) => notEmptyString(tg.name))
      .map((tg) => tg.name)
      .join(", ");
  }

  get hasNext(): boolean {
    return this.next.isValid();
  }

  get hasPrev(): boolean {
    return this.prev.isValid();
  }
}

export class Tag {
  id = 0;
  name = "";
  slug = "";

  constructor(resource: any = null) {
    if (resource instanceof Object) {
      if (typeof resource.slug === "string") {
        this.slug = resource.slug;
      }
      if (typeof resource.id === "number") {
        this.id = resource.id;
      }
      if (notEmptyString(resource.name, 7)) {
        this.name = resource.name;
      }
    }
  }

  isValid() {
    return (
      this.id > 0 && notEmptyString(this.slug) && notEmptyString(this.name)
    );
  }
}

export class YearLink {
  title = "";
  year = 0;
  index = 0;

  constructor(year: number, index = 0) {
    if (year > 1900) {
      this.title = year.toString();
      this.year = year;
    }
    if (index >= 0) {
      this.index = index;
    }
  }

  get link() {
    return `/${this.year}`;
  }
}

const randomImage = () => {
  const num = defImages.length;
  const index = Math.floor(Math.random() * num * 0.9999999);
  const imgRef = defImages[index];
  return [API_URI, imgBase, imgRef].join("/");
};

export const buildMeta = (pageTitle = "", items: Post[] = []) => {
  const title = notEmptyString(pageTitle)
    ? [siteTitle, pageTitle].join(": ")
    : pageTitle;
  let description = "Post listing";
  let image = "";
  if (items.length > 0) {
    description = items[0].excerpt;
    image = items[0].previewImg;
  } else {
    description = siteDesc;
    image = randomImage();
  }
  return new MetaTagSet({ title, description, image });
};
