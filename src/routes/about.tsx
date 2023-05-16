import { A, useRouteData } from "solid-start";
import { fetchPages } from "~/api/fetch";
import { For, createResource } from "solid-js";

export function routeData() {
  const [pages] = createResource(async () => {
    return await fetchPages('insanity', 0, 1);
  });
  return { pages };
}

export default function About() {
  const { pages } = useRouteData<typeof routeData>();
  
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <section>
         <For each={pages()}>
          {(page) => <article>
            <h3 class="max-6-xs text-4xl text-sky-700 font-thin my-16">{page.title}</h3>
            <div innerHTML={page.content} class="inner">
              {page.content}
            </div>
          </article>}
          </For>
    </section>
    </main>
  );
}

