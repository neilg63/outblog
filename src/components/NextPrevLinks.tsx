import { A } from "@solidjs/router";
import { Accessor, Show } from "solid-js";
import { PostPreview } from "~/api/models";

export default function NextPrevLink({ item, mode }: { item: Accessor<PostPreview | undefined>, mode: string }) {
  const className = ['direction', mode].join(" ");
  return <Show when={item()}>
    <div class={className}>
      <A href={item()!.uri}>{ item()?.title }</A>
    </div>
  </Show>
}
