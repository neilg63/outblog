// @refresh reload
import { For, Suspense, createMemo, createResource } from "solid-js";
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
import { generateYearLinks } from "./api/utils";


export default function Root() {
  const location = useLocation();
  const yearLinks = createMemo(() => generateYearLinks());
  const footerYeakLinks = createMemo(() => generateYearLinks(50, startYear));
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  return (
    <Html lang="en">
      <Head>
        <Title>{ siteTitle }</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <nav class="bg-sky-800">
              <ul class="container flex items-center p-3 text-gray-200">
                <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
                  <A href="/">Home</A>
                </li>
                <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
                  <A href="/about">About</A>
                </li>
                <For each={yearLinks()}>
                  {(item) => <li class={`border-b-2 ${active(item?.link)} mx-1.5 sm:mx-6`}>
                    <A href={item?.link}>{ item.title }</A>
                </li>}
                </For>
              </ul>
            </nav>
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
