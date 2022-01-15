type Props = {
  raw: string;
  className?: string;
};

export function SvgIcon({ raw, className }: Props) {
  const styledSvg =
    raw.indexOf(' class="') === -1
      ? raw.replace('<svg ', `<svg class="${className}" `)
      : raw;

  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{ __html: styledSvg }} />;
}
