import { A, useParams, useRouteData } from "solid-start";
import { fetchByTag } from "~/api/fetch";
import { Accessor, createEffect, createResource, createSignal } from "solid-js";
import { notEmptyString } from "~/api/utils";
import { Post, buildMeta } from "~/api/models";
import CustomHead from "~/components/layout/CustomHead";
import PostList from "~/components/PostList";
import { extractMatchedTag } from "~/lib/localstore";

export function routeData() {
  const params = useParams();
  const slug = notEmptyString(params.tag) ? params.tag : "";
  const [posts] = createResource(async () => {
    const results = await fetchByTag(slug);
    return results;
  });
  return { posts };
}

const extractTagName = (posts: Accessor<Post[] | undefined>, tagRef: string): string => {
  const items = posts();
  if (items instanceof Array && items.length > 0) {
    return items[0].mainTag.name;
  } else {
    return tagRef;
  }
}

const extractPageTitle  = (posts: Accessor<Post[] | undefined>, tagRef: string): string => {
  const tagName = extractTagName(posts, tagRef)
  return `Filtered by ${tagName}`
}

export default function ListByTag() {
  const { posts } = useRouteData<typeof routeData>();
  const params = useParams();
  const [items, setItems] = createSignal(posts());
  const tagName = extractPageTitle(items, params.tag);
  const [metaData, setMetaData] = createSignal(buildMeta(tagName, items()));
  const [pageTitle, setPageTitle] = createSignal(extractPageTitle(items, params.tag))
  createEffect(() => {
    const params = useParams();
    const tagItem = extractMatchedTag(params.tag)
    fetchByTag(params.tag, tagItem).then((data) => {
      if (data instanceof Array) {
        setItems(data);
        setMetaData(buildMeta(params.tag, items()));
        setPageTitle(extractPageTitle(items, params.tag));
      }
    })
  });
  return (
    <>
      <CustomHead meta={metaData} />
      <main class="text-center mx-auto text-gray-700 p-4">
        <h1 class="max-6-xs text-6xl text-sky-700 font-thin my-16">
          {pageTitle()}
        </h1>
        <PostList items={items} />
      </main>
    </>
  );
}
