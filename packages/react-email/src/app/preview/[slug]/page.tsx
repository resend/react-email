export default async function PreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const Email = (await import(`../../emails/${params.slug}`)).default.default;

  return (
    <div>
      <Email {...Email.PreviewProps} />
    </div>
  );
}
