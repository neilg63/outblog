import { Accessor, Show, createEffect, createSignal} from "solid-js";
import { Post } from "~/api/models";
import NextPrevLink from "./NextPrevLinks";

export default function Article({ post }: { post: Accessor<Post | undefined> }) {
  const [prevItem, setPrevItem] = createSignal(post()?.prev);
  const [nextItem, setNextItem] = createSignal(post()?.next);
  createEffect(() => {
    setNextItem(post()?.next)
    setPrevItem(post()?.prev)
  });
  return <section class="main-content">
    <h1 class="max-4-xs text-4xl text-sky-700 font-thin my-16 inner-content">
      {post()?.title}
    </h1>
    <p class="date inner-content"><time>{ post()?.longDate }</time></p>
    <article innerHTML={post()?.content} class="inner-content"></article>
    <nav class="flex adjacent">
      <NextPrevLink item={nextItem} mode="next" />
      <NextPrevLink item={prevItem} mode="prev" />
    </nav>
  </section>
}
