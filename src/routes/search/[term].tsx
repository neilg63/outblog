import { A, Title, useParams, useRouteData } from "solid-start";
import { fetchTopPosts, searchPosts } from "~/api/fetch";
import { For, createResource, createSignal } from "solid-js";
import { perPage } from "~/api/settings";
import PostList from "~/components/PostList";
import { createEffect } from "solid-js";
import { notEmptyString } from "~/api/utils";
import { fromLocal } from "~/lib/localstore";
import { MetaTagSet } from "~/api/models";

export function routeData() {
  const params = useParams();
  const [posts] = createResource(async () => {
    const results = await searchPosts(params.term, 0, perPage);
    return results;
  });
  return { posts };
}

export default function SearchPage() {
  const { posts } = useRouteData<typeof routeData>();
  const params = useParams();
  const searchString = notEmptyString(params.term) ? params.term.replace(/\.\*/i, ' ') : '';
  const [items, setItems] = createSignal(posts());
  const [pageTitle, setPageTitle] = createSignal(searchString);
  const fetchAndSetTitle = () => {
    const storedTitle = fromLocal("search-phrase", 7200);
    const searchString = (storedTitle.valid && !storedTitle.expired)? storedTitle.data : notEmptyString(params.term) ? params.term.replace(/\.\*/i, ' ') : '';
    setPageTitle(searchString);
  }
  createEffect(() => {
    const params = useParams();
    setTimeout(fetchAndSetTitle, 50);
    searchPosts(params.term, 0, perPage).then((data) => {
      if (data instanceof Array) {
        setItems(data);
        setTimeout(fetchAndSetTitle, 250);
      }
    })
  });
  const image = "";
  const meta = new MetaTagSet({ title: pageTitle(), description: pageTitle(), image })
  return (
    <>
      <Title>{ meta.title }</Title>
       <main class="text-center mx-auto text-gray-700 p-4">
        <h1 class="max-6-xs text-6xl text-sky-700 font-thin my-16">
          {pageTitle()}
        </h1>
        <ul class="text-center">
        <PostList items={items} />
        </ul>
      </main>
    </>
  );
}
