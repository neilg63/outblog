import { Accessor, For } from "solid-js";
import { MetaTagSet } from "../../api/models";
import { Link, Meta, Title } from "solid-start";
import { ICON_BASE } from "~/api/settings";

export default function CustomHead({ meta }: { meta: Accessor<MetaTagSet | undefined> }) {
  const buildIconLink = (subPath = "") => [ICON_BASE, subPath].join("/");
  return <>
      <Title>{meta()?.title}</Title>
      <Meta property="og:type" content="article" />
      <Meta property="og:title" content={meta()?.title} />
      <Meta property="twitter:title" content={meta()?.title} />
      <Meta name="description" content={meta()?.description} />
      <Meta property="og:description" content={meta()?.description} />
      <Meta property="twitter:description" content={meta()?.description} />
      <Meta property="og:image" content={meta()?.image} />
      <Meta property="twitter:card" content="summary_large_image" />
    <Meta name="twitter:image" content={meta()?.image} />
    	<Link rel="apple-touch-icon" sizes="180x180" href={buildIconLink("apple-touch-icon.png")} />
      <Link rel="icon" type="image/png" sizes="32x32" href={buildIconLink("favicon-32x32.png")} />
      <Link rel="icon" type="image/png" sizes="16x16" href={buildIconLink("favicon-16x16.png")} />
      <Link rel="manifest" href={buildIconLink("site.webmanifest")} />
      <Link rel="mask-icon" href={buildIconLink("safari-pinned-tab.svg")} color="#5bbad5" />
      <Link rel="shortcut icon" href={buildIconLink("favicon.ico")} />
  </>;
}
