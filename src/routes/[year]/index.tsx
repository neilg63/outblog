import { For, createEffect, createResource, createSignal } from "solid-js";
import { A, Head, Meta, Title, useParams, useRouteData } from "solid-start";
import { fetchTopPosts } from "~/api/fetch";
import { buildMeta } from "~/api/models";
import { perPage } from "~/api/settings";
import { isNumeric } from "~/api/utils";
import PostList from "~/components/PostList";
import CustomHead from "~/components/layout/CustomHead";

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
  const [metaData, setMetaData] = createSignal(buildMeta(yearLabel(), items()));
  createEffect(() => {
    const year = isNumeric(params.year) ? parseInt(params.year) : 0;
    setYearLabel(year > 1970 ? `${year} Blogroll` : 'Not Found');
    fetchTopPosts(0, perPage, year, 0).then((data) => {
      if (data instanceof Array) {
        setItems(data);
        setMetaData(buildMeta(yearLabel(), items()));
      }
    })
  });
  return (
    <>
      <CustomHead meta={metaData} />
      <h2 class="supplementary-title">{metaData().pageTitle}</h2>
      <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        {yearLabel()}
      </h1>
        <PostList items={items} />
      </main>
    </>
  )
}
