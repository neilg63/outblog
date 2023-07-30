import { A } from "@solidjs/router";
import { Accessor, Show } from "solid-js";
import { PostPreview } from "~/api/models";

export default function NextPrevLink({ item, mode }: { item: Accessor<PostPreview | undefined>, mode: string }) {
  const cls = ['direction', mode];
  if (item()?.isValid()) {
    cls.push('has-link');
  }
  const className = cls.join(" ");
return <Show when={item()?.isValid()}>
    <div class={className}>
      <A href={item()!.uri}>{ item()?.title }</A>
    </div>
  </Show>
}
