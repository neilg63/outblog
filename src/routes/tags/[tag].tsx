import { A, useParams, useRouteData } from "solid-start";
import { fetchByTag, fetchTopPosts } from "~/api/fetch";
import { For, createResource } from "solid-js";
import { perPage } from "~/api/settings";
import { isNumeric, notEmptyString } from "~/api/utils";

export function routeData() {
  const params = useParams();
  const slug = notEmptyString(params.tag) ? params.tag : "";
  const [posts] = createResource(async () => {
    const results = await fetchByTag(slug);
    return results;
  });
  return { posts };
}

export default function ListByTag() {
  const { posts } = useRouteData<typeof routeData>();
  const params = useParams();
  let tagName = params.slug;
  const items = posts();
  if (items instanceof Array && items.length > 0) {
    tagName = items[0].mainTag.name;
  }
  const pageTitle = `Filtered by ${tagName}`;
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        {pageTitle}
      </h1>
      <ul class="text-center">
      <For each={posts()}>
          {(post) => <li>
            <p><time>{ post.mediumDate }</time></p>
            <h4><A href={post.uri}>{post.title}</A></h4>
            <img src={post.previewImg} />
            <article innerHTML={post.excerpt} />
            <p>{post.tagList}</p>
          </li>}
      </For>
    </ul>
    </main>
  );
}
