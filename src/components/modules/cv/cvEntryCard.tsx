export type CvEntryCardProps = {
  title: string;
  role?: string;
  location: string;
  dateRanges: Array<string>;
  bullets: Array<string>;
};

export function CvEntryCard({ title, role, location, dateRanges, bullets }: CvEntryCardProps) {
  return (
    <div className="bg-card text-card-foreground border border-border border-l-4 border-l-theme-500 rounded-lg p-3 sm:p-4 md:p-6 flex flex-col gap-3 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
        <div>
          <h3 className="text-lg font-bold leading-tight">{title}</h3>
          {role ? <h4 className="text-muted-foreground font-medium">{role}</h4> : null}
          <small className="text-muted-foreground">{location}</small>
        </div>
        <div className="text-sm text-muted-foreground sm:text-right shrink-0">
          {dateRanges.map((range) => (
            <div key={range}>{range}</div>
          ))}
        </div>
      </div>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}
