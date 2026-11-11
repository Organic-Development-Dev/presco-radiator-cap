const formatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" });

export function PostDate({ date, className }: { date: string | null | undefined; className?: string }) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return (
    <time dateTime={d.toISOString()} className={className}>
      {formatter.format(d)}
    </time>
  );
}
