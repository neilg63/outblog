import { A, useParams, useRouteData } from "solid-start";
import { fetchTopPosts } from "~/api/fetch";
import { For, createEffect, createResource, createSignal } from "solid-js";
import { perPage } from "~/api/settings";
import { isNumeric, renderNextLabel, renderPageLink } from "~/api/utils";
import PostList from "~/components/PostList";

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
  const [pageTitle, setPageTitle] = createSignal(`Page ${page}`);
  const [items, setItems] = createSignal(posts());
  const [nextLink, setNextLink] = createSignal(renderPageLink(page + 1));
  const [nextLabel, setNextLabel] = createSignal(renderNextLabel(page + 1));
  createEffect(() => {
    const page = params?.page && isNumeric(params?.page) ? parseInt(params.page) : 1;
    const start = page > 0 ? (page - 1) * perPage : 0;
    setNextLink(renderPageLink(page + 1));
    setNextLabel(renderNextLabel(page + 1));
    setPageTitle(`Page ${page}`);
    fetchTopPosts(start, perPage).then((data) => {
      if (data instanceof Array) {
        setItems(data);
      }
    })
  })
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-4-xs text-4xl text-sky-700 font-thin my-16">
        {pageTitle()}
      </h1>
      <PostList items={items} />
      <p><A href={nextLink()}>{ nextLabel() }</A></p>
    </main>
  );
}
