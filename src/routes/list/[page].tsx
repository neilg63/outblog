import { A, Title, useParams, useRouteData } from "solid-start";
import { fetchTopPosts } from "~/api/fetch";
import { Accessor, For, Show, createEffect, createResource, createSignal } from "solid-js";
import { perPage, siteTitle, startYear } from "~/api/settings";
import { isNumeric, notEmptyString, renderNextLabel, renderPageLink, renderPrevLabel } from "~/api/utils";
import PostList from "~/components/PostList";
import { Post, buildMeta } from "~/api/models";
import CustomHead from "~/components/layout/CustomHead";

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


const hasMorePosts = (page = 0, items: Accessor<Post[] | undefined>) => {
  const numPosts = items()?.length;
  let hasMorePosts = page < 9;
  if (!hasMorePosts && numPosts !== undefined && numPosts > 0) {
    const lastPost = items()?.[numPosts - 1];
    if (lastPost instanceof Object) {
      if (notEmptyString(lastPost.uri) && lastPost.uri.startsWith('/')) {
        const year = lastPost.uri.substring(1).split('/').shift();
        const yearInt = parseInt(year as string, 10);
        hasMorePosts = yearInt > startYear;
      }
    }
  }
  return hasMorePosts;
}

export default function List() {
  const { posts } = useRouteData<typeof routeData>();
  const params = useParams();
  const page = params?.page && isNumeric(params?.page) ? parseInt(params.page) : 1;
  const [pageTitle, setPageTitle] = createSignal(`Page ${page}`);
  const [items, setItems] = createSignal(posts());
  const [nextLink, setNextLink] = createSignal(renderPageLink(page + 1));
  const [prevLink, setPrevLink] = createSignal(renderPageLink(page - 1));
  const [nextLabel, setNextLabel] = createSignal(renderNextLabel(page + 1));
  const [prevLabel, setPrevLabel] = createSignal(renderNextLabel(page - 1));
  const [hasPrev, setHasPrev] = createSignal(page > 1);
  
  
  const [hasNext, setHasNext] = createSignal(hasMorePosts(page, items));

  const [metaData, setMetaData] = createSignal(buildMeta(pageTitle(), items()));
  createEffect(() => {
    const page = params?.page && isNumeric(params?.page) ? parseInt(params.page) : 1;
    const start = page > 0 ? (page - 1) * perPage : 0;
    setNextLink(renderPageLink(page + 1));
    setPrevLink(renderPageLink(page - 1));
    setNextLabel(renderNextLabel(page + 1));
    setPrevLabel(renderPrevLabel(page - 1));
    setPageTitle(`Page ${page}`);
    fetchTopPosts(start, perPage).then((data) => {
      if (data instanceof Array) {
        setItems(data);
        setMetaData(buildMeta(pageTitle(), items()));
        setHasPrev(page > 1);
        if (page > 8) {
          setHasNext(hasMorePosts(page, items));
        } else {
          setHasNext(true);
        }
      }
    })
  })
  return (
    <>
      <CustomHead meta={metaData} />
      <h2 class="supplementary-title">{metaData().pageTitle}</h2>
      <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-4-xs text-4xl text-sky-700 font-thin my-16">
        {pageTitle()}
      </h1>
        <PostList items={items} />
        <p class="list-page-nav">
          <Show when={hasPrev()}><A href={prevLink()} class="prev">{prevLabel()}</A></Show>
          <Show when={hasNext()}><A href={nextLink()} class="next">{nextLabel()}</A></Show>
        </p>
      </main>
    </>
  );
}
