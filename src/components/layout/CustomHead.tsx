import { Accessor, For } from "solid-js";
import { MetaTagSet } from "../../api/models";
import { Meta, Title } from "solid-start";

export default function CustomHead({ meta }: { meta: Accessor<MetaTagSet | undefined> }) {
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
  </>;
}
