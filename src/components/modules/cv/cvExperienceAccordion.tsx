import { CvEntryCard, type CvEntryCardProps } from "@/components/modules/cv/cvEntryCard";
import { Accordion } from "@/components/ui/accordion";

export function CvExperienceAccordion({
  title,
  entries,
  classNames,
}: {
  title: string;
  entries: Array<CvEntryCardProps>;
  classNames?: string;
}) {
  return (
    <Accordion size="xl" title={title} classNames={classNames}>
      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <CvEntryCard key={entry.title} {...entry} />
        ))}
      </div>
    </Accordion>
  );
}
