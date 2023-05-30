import { A } from "@solidjs/router";
import { Accessor, For} from "solid-js";
import { Post } from "~/api/models";

export default function PostList({items}: {items: Accessor<Post[] | undefined>}) {
  return <ul class="content-list">
    <For each={items()}>
      {(post) => <li class="flex inner-content">
        <figure><A href={post.uri}><img src={post.previewImg} width={ post.previewSize.width} height={ post.previewSize.height} alt={post.title} /></A></figure>
        <div class="info">
            <p class="date"><time>{ post.mediumDate }</time></p>
            <h4 class="max-2-xs text-2xl text-sky-700 font-thin"><A href={post.uri}>{post.title}</A></h4>
          <article class="excerpt"><span innerHTML={post.excerpt} class="text-snippet"></span><A href={post.uri } class="more-link">⋯</A></article>
            <p>{post.tagList}</p>
        </div>
        </li>}
    </For>
  </ul>
}
