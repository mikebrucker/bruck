import { CvEntryCard, type CvEntryCardProps } from "@/components/modules/cv/cvEntryCard";
import { Accordion, type HeadingLevel } from "@/components/ui/accordion";

export function CvExperienceAccordion({
  title,
  entries,
  classNames,
  headingLevel,
}: {
  title: string;
  entries: Array<CvEntryCardProps>;
  classNames?: string;
  headingLevel?: HeadingLevel;
}) {
  return (
    <Accordion size="xl" title={title} classNames={classNames} headingLevel={headingLevel}>
      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <CvEntryCard key={entry.title} {...entry} />
        ))}
      </div>
    </Accordion>
  );
}
