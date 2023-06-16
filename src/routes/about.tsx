import { A, useRouteData } from "solid-start";
import { fetchPages } from "~/api/fetch";
import { For, createEffect, createResource, createSignal } from "solid-js";
import { buildMeta } from "~/api/models";
import CustomHead from "~/components/layout/CustomHead";

export function routeData() {
  const [pages] = createResource(async () => {
    return await fetchPages('insanity', 0, 1);
  });
  return { pages };
}

export default function About() {
  const { pages } = useRouteData<typeof routeData>();
  const [metaData, setMetaData] = createSignal(buildMeta("About", pages()));

  return (
    <>
      <CustomHead meta={metaData} />
      <h2 class="supplementary-title">{metaData()?.pageTitle}</h2>
      <main class="text-center mx-auto text-gray-700 p-4">
       <For each={pages()}>
        {(page) => <article class="inner-content">
            <h3 class="max-4-xs text-4xl text-sky-700 font-thin my-4">{page.title}</h3>
          <div innerHTML={page.content} class="inner">
            {page.content}
          </div>
        </article>}
        </For>
      </main>
    </>
  );
}

