import { A, createRouteData, useParams, useRouteData } from "solid-start";
import { fetchPost} from "~/api/fetch";
import { Show, createEffect, createSignal } from "solid-js";
import Article from "~/components/Article";
import { notEmptyString } from "~/api/utils";

export function routeData() {
  const params = useParams();
  const post = createRouteData(async () => {
    return await fetchPost(params.slug);
  });
  return post;
}

export default function SlugPage() {
  const params = useParams();
  const post = useRouteData<typeof routeData>();
  const [item, setItem] = createSignal(post());
   createEffect(() => {
     const slug = notEmptyString(params.slug) ? params.slug : "";
    fetchPost(slug).then((data) => {
      if (data instanceof Object) {
        setItem(data);
      }
    })
  });
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Show when={item()?.isValid}>
        <Article post={item} />
      </Show>
    </main>
  );
}
