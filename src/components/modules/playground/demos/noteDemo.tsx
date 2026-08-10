"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoText } from "@/components/modules/playground/demoText";
import { DemoTextArea } from "@/components/modules/playground/demoTextArea";
import { useDemoState } from "@/components/modules/playground/useDemoState";
import { Note } from "@/components/ui/note";

function NoteDemo() {
  const { t } = useTranslation();
  const [text, setText] = useDemoState(t(($) => $.playground.demos.note.text));
  const [classNames, setClassNames] = useState("");

  return (
    <DemoCard
      name="Note"
      description={t(($) => $.playground.demos.note.description)}
      controls={
        <>
          <DemoTextArea label="text" value={text} stacked onChange={setText} />
          <DemoText
            placeholder="Tailwind classNames"
            label="classNames"
            value={classNames}
            onChange={setClassNames}
            stacked
          />
        </>
      }
    >
      <Note text={text} className={classNames} />
    </DemoCard>
  );
}

export { NoteDemo };
