import { A } from "@solidjs/router";
import { Accessor, For} from "solid-js";
import { Post } from "~/api/models";

export default function PostList({items}: {items: Accessor<Post[] | undefined>}) {
  return <ul class="text-center">
    <For each={items()}>
      {(post) => <li class="flex">
        <figure><A href={post.uri}><img src={post.previewImg} width={ post.previewSize.width} height={ post.previewSize.height} /></A></figure>
        <div class="info">
            <p class="date"><time>{ post.mediumDate }</time></p>
            <h4><A href={post.uri}>{post.title}</A></h4>
            <article innerHTML={post.excerpt} class="excerpt" />
            <p>{post.tagList}</p>
        </div>
        </li>}
    </For>
  </ul>
}
