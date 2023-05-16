import { For, createEffect, createResource, createSignal } from "solid-js";
import { A, Head, Meta, Title, useParams, useRouteData } from "solid-start";
import { fetchTopPosts } from "~/api/fetch";
import { perPage } from "~/api/settings";
import { isNumeric } from "~/api/utils";

export function routeData() {
  const params = useParams();
  const year = isNumeric(params.year) ? parseInt(params.year) : 0;
  const [posts] = createResource(async () => {
    const results = await fetchTopPosts(0, perPage, year, 0);
    return results;
  });
  return { posts };
}

export default function YearList() {
  const params = useParams();
  const { posts } = useRouteData<typeof routeData>();
  const [items, setItems] = createSignal(posts());
  const [yearLabel, setYearLabel] = createSignal("");
  createEffect(() => {
    const year = isNumeric(params.year) ? parseInt(params.year) : 0;
    setYearLabel(year > 1970 ? `${year} Blogroll` : 'Not Found');
    fetchTopPosts(0, perPage, year, 0).then((data) => {
      if (data instanceof Array) {
        setItems(data);
      }
    })
  });
  return (
    <>
    <Meta name="description" content={ yearLabel() } />
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        {yearLabel()}
      </h1>
      <ul class="text-center">
        <For each={items()}>
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
      </>
  )
}
