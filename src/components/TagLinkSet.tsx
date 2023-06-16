import { A } from "@solidjs/router";
import { Accessor, For, Show} from "solid-js";
import { useLocation } from "solid-start";
import { Tag } from "~/api/models";

export default function TagLinkSet({ tagList, toggle }: { tagList: Accessor<Tag[] | undefined>, toggle: Function | boolean }) {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  const hasToggle = toggle instanceof Function;
  const toggleFunc = toggle instanceof Function ? toggle : () => { };
  return <Show when={tagList()}>
    <ul class="inline-flex flex-wrap justify-items-center items-center">
      <For each={tagList()}>
        {(item) => <li class={`${active(item?.link)} mx-1.5 sm:mx-6`}>
            <A href={item?.link} class="p-2 flex bg-sky-800 rounded-lg shadow-lg">
              <span class="text">{item.name}</span>
              <sup class="count">{item?.count}</sup>
            </A>
        </li>}
      </For>
      <Show when={hasToggle}>
        <li class="hide-tags"><A href='#hide-tags' onClick={(e) => toggleFunc(e)} class="p-2 flex bg-sky-800 rounded-xl shadow-lg"><strong>⬉</strong> <em>Hide tags</em> </A></li>
      </Show>
    </ul>
  </Show>
}



