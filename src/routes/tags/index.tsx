import { For, createEffect, createResource, createSignal } from "solid-js";
import { A, Head, Meta, Title, useParams, useRouteData } from "solid-start";
import { fetchTags, fetchTopPosts } from "~/api/fetch";
import { buildMeta } from "~/api/models";
import TagLinkSet from "~/components/TagLinkSet";
import CustomHead from "~/components/layout/CustomHead";
import { fetchStoredTags, getStoredTags } from "~/lib/localstore";

export function routeData() {
  const tags = createResource(async () => {
    const results = await fetchTags();
    return results;
  });
  return tags;
}

export default function TagsLanding() {
  const [tags] = useRouteData<typeof routeData>();
  const [items, setItems] = createSignal(tags());
  const [metaData, setMetaData] = createSignal(buildMeta("Tag Maze", []));
  createEffect(() => {
    fetchStoredTags().then((data) => {
      if (data instanceof Array) {
        setItems(data);
      }
    })
  });
  return (
    <>
      <CustomHead meta={metaData} />
      <h2 class="supplementary-title">{metaData().pageTitle}</h2>
      <main class="text-center mx-auto text-gray-700 p-4">
        <h1 class="max-6-xs text-6xl text-sky-700 font-thin my-4">
          {metaData().pageTitle}
        </h1>
        <section class="flex tag-maze flex-center">
          <TagLinkSet tagList={items} toggle={false}/>
        </section>
      </main>
    </>
  )
}
