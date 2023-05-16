import { A, useRouteData } from "solid-start";
import { fetchTopPosts } from "~/api/fetch";
import { For, createResource } from "solid-js";
import { siteTitle, perPage } from "~/api/settings";

export function routeData() {
  const [posts] = createResource(async () => {
    const results = await fetchTopPosts(0, perPage);
    return results;
  });
  return { posts };
}

export default function Home() {
  const { posts } = useRouteData<typeof routeData>();
  const nextPage = 2;
  const nextLink = `/list/${nextPage}`
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        {siteTitle}
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
      <p><A href={nextLink}>{ nextPage }</A></p>
    </main>
  );
}
