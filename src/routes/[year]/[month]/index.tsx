import { For, createResource } from "solid-js";
import { A, useParams, useRouteData } from "solid-start";
import { fetchTopPosts } from "~/api/fetch";
import { isNumeric, renderYearMonth } from "~/api/utils";

export function routeData() {
  const params = useParams();
  const year = isNumeric(params.year) ? parseInt(params.year) : 0;
  const month = isNumeric(params.month) ? parseInt(params.month) : 0;
  const [posts] = createResource(async () => {
    const results = await fetchTopPosts(0, 32, year, month);
    return results;
  });
  return { posts };
}

export default function MonthList() {
  const params = useParams();
  const year = isNumeric(params.year) ? parseInt(params.year) : 0;
  const month = isNumeric(params.month) ? parseInt(params.month) : 0;
  const { posts } = useRouteData<typeof routeData>();
  const yearMonth = renderYearMonth(year, month);
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        {yearMonth}
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
  )
}
