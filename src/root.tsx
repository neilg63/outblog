// @refresh reload
import { For, Suspense, createEffect, createMemo, createResource, createSignal } from "solid-js";
import {
  useLocation,
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
  useRouteData,
} from "solid-start";
import "./root.css";
import { siteTitle, startYear } from "./api/settings";
import { generateYearLinks, notEmptyString } from "./api/utils";
import { fromLocal, toLocal } from "./lib/localstore";
import { getScrollTopPos } from "./lib/scroll";

interface DisplayOpts {
  dark: boolean;
  size: string;
}

export default function Root() {
  const location = useLocation();
  const yearLinks = createMemo(() => generateYearLinks());
  const footerYeakLinks = createMemo(() => generateYearLinks(50, startYear));
  const wrClasses = ["light", "size-m"];
  const [wrapperClasses, setWrapperClasses] = createSignal(wrClasses.join(" "));
  const [topOs, setTopPos] = createSignal(true);
  const setDisplayMode = (dark = false) => {
    const opts = extractDisplayOptions();
    opts.dark = dark;
    toLocal("display", opts);
  }
  const setBaseFontSize = (size = "m") => {
    const opts = extractDisplayOptions();
    if (notEmptyString(size)) {
      opts.size = size.toLowerCase();
      toLocal("display", opts);
      setTimeout(setDisplayClasses, 50);
    }
  }
  const extractDisplayOptions = (): DisplayOpts => {
    const stored = fromLocal("display", 3600);
    const dark = !stored.expired ? stored.data.dark === true : false;
    const size = !stored.expired && notEmptyString(stored.data.size) ? stored.data.size : "m";
    return { size, dark };
  }
  const setDisplayClasses = () => {
    const { dark, size } = extractDisplayOptions();
    const cls = [dark ? "dark-mode" : "light-mode"];
    cls.push(["size", size].join("-"));
    setWrapperClasses(cls.join(" "));
  }
  createEffect(() => {
    setDisplayClasses();
    setTimeout(getScrollTopPos, 3090)
  });
  const toggleDisplayMode = () => {
    const { dark } = extractDisplayOptions();
    setDisplayMode(!dark);
    setTimeout(setDisplayClasses, 50);
  }
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  return (
    <Html lang="en" class={ wrapperClasses() }>
      <Head>
        <Title>{ siteTitle }</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <header class="bg-sky-800 flex top-header flex items-center p-2 text-gray-200">
              <nav class="main-nav">
                <ul class="container flex items-center p-2 text-gray-200">
                  <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
                    <A href="/">Home</A>
                  </li>
                  <li class={`border-b-2 ${active("/about")} mx-1 sm:mx-6`}>
                    <A href="/about">About</A>
                  </li>
                  <For each={yearLinks()}>
                    {(item) => <li class={`border-b-2 ${active(item?.link)} mx-1.5 sm:mx-6`}>
                      <A href={item?.link}>{ item.title }</A>
                  </li>}
                  </For>
                </ul>
              </nav>
              <nav class="flex display-options">
                <div class="flex display-mode-toggle" onClick={() => toggleDisplayMode()}>
                  <span class="light option">☀︎</span>
                  <span class="dark option">☽</span>
                </div>
                <div class="text-size small" onClick={() => setBaseFontSize("s")} title="Small">A<sup>-</sup></div>
                <div class="text-size medium" onClick={() => setBaseFontSize("m")} title="Medium">A</div>
                <div class="text-size large" onClick={() => setBaseFontSize("l")} title="Large">A<sup>+</sup></div>
              </nav>
            </header>
            <Routes>
              <FileRoutes />
            </Routes>
            <footer>
              <nav>
                <ul class="inline-flex flex-wrap justify-items-center items-center">
                  <For each={footerYeakLinks()}>
                  {(item) => <li class={`border-b-2 ${active(item?.link)} mx-1.5 sm:mx-6`}>
                      <A href={item?.link} class="p-2 flex bg-indigo-500 rounded-lg shadow-lg">{item.title}</A>
                  </li>}
                  </For>
                </ul>
              </nav>
            </footer>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
