import { A, useParams, useRouteData } from "solid-start";
import { fetchTopPosts } from "~/api/fetch";
import { For, createResource } from "solid-js";
import { perPage } from "~/api/settings";
import { isNumeric } from "~/api/utils";

export function routeData() {
  const params = useParams();
  const page = params?.page && isNumeric(params?.page) ? parseInt(params.page) : 1;
  const start = page > 0 ? (page - 1) * perPage : 0;
  const [posts] = createResource(async () => {
    const results = await fetchTopPosts(start, perPage);
    return results;
  });
  return { posts };
}

export default function List() {
  const { posts } = useRouteData<typeof routeData>();
  const params = useParams();
  const page = params?.page && isNumeric(params?.page) ? parseInt(params.page) : 1;
  const pegeTitle = `Page ${page}`;
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        {pegeTitle}
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
