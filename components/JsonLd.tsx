export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    // CMS text must never be able to close the script element.
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  }} />;
}
