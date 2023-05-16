import { A, createRouteData, useParams, useRouteData } from "solid-start";
import { fetchPost} from "~/api/fetch";
import { For, Match, Show } from "solid-js";
import { Post } from "~/api/models";

export function routeData() {
  const params = useParams();
  const post = createRouteData(async () => {
    return await fetchPost(params.slug);
  });
  return post;
}

export default function SlugPage() {
  const post = useRouteData<typeof routeData>();
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Show when={post()}>
        <h1 class="max-4-xs text-4xl text-sky-700 font-thin my-16">
        {post()?.title}
      </h1>
      <p><time>{ post()?.longDate }</time></p>
      
      <article innerHTML={post()?.content}>{ post()?.content}</article>
      </Show>
    </main>
  );
}
