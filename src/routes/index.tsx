import { A, useRouteData } from "solid-start";
import { fetchTopPosts } from "~/api/fetch";
import { For, createResource, createSignal } from "solid-js";
import { siteTitle, perPage } from "~/api/settings";
import PostList from "~/components/PostList";
import { createEffect } from "solid-js";
import { renderNextLabel } from "~/api/utils";

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
  const nextLabel = renderNextLabel(2);
  const nextLink = `/list/${nextPage}`
  const [items, setItems] = createSignal(posts());
  createEffect(() => {
    fetchTopPosts(0, perPage).then((data) => {
      if (data instanceof Array) {
        setItems(data);
      }
    })
  })
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        {siteTitle}
      </h1>
      <ul class="text-center">
      <PostList items={items} />
      </ul>
      <p><A href={nextLink}>{ nextPage }</A></p>
    </main>
  );
}
