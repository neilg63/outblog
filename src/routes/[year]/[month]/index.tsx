import { createEffect, createResource, createSignal } from "solid-js";
import { A, useParams, useRouteData } from "solid-start";
import { fetchTopPosts } from "~/api/fetch";
import { isNumeric, renderYearMonth } from "~/api/utils";
import PostList from "~/components/PostList";

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
  const [items, setItems] = createSignal(posts());
  const yearMonth = renderYearMonth(year, month);
  const [yearLabel, setYearLabel] = createSignal(yearMonth);
  createEffect(() => {
    const year = isNumeric(params.year) ? parseInt(params.year) : 0;
    const month = isNumeric(params.month) ? parseInt(params.month) : 0;
    setYearLabel(renderYearMonth(year, month));
    fetchTopPosts(0, 100, year, month).then((data) => {
      if (data instanceof Array) {
        setItems(data);
      }
    })
  });
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        {yearLabel()}
      </h1>
      <PostList items={items} />
    </main>
  )
}
