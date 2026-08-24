"use client";

import { useTranslation } from "react-i18next";
import { AccordionDemo } from "@/components/modules/playground/demos/accordionDemo";
import { ButtonDemo } from "@/components/modules/playground/demos/buttonDemo";
import { CheckboxDemo } from "@/components/modules/playground/demos/checkboxDemo";
import { ChipDemo } from "@/components/modules/playground/demos/chipDemo";
import { DrawerDemo } from "@/components/modules/playground/demos/drawerDemo";
import { FabDemo } from "@/components/modules/playground/demos/fabDemo";
import { FormDemo } from "@/components/modules/playground/demos/formDemo";
import { InputDemo } from "@/components/modules/playground/demos/inputDemo";
import { LoaderDemo } from "@/components/modules/playground/demos/loaderDemo";
import { ModalDemo } from "@/components/modules/playground/demos/modalDemo";
import { NoteDemo } from "@/components/modules/playground/demos/noteDemo";
import { PopoverDemo } from "@/components/modules/playground/demos/popoverDemo";
import { RadioGroupDemo } from "@/components/modules/playground/demos/radioGroupDemo";
import { SelectDemo } from "@/components/modules/playground/demos/selectDemo";
import { SeparatorDemo } from "@/components/modules/playground/demos/separatorDemo";
import { SliderDemo } from "@/components/modules/playground/demos/sliderDemo";
import { SortableListDemo } from "@/components/modules/playground/demos/sortableListDemo";
import { SwitchDemo } from "@/components/modules/playground/demos/switchDemo";
import { TabsDemo } from "@/components/modules/playground/demos/tabsDemo";
import { TechIntDemoRange } from "@/components/modules/playground/demos/techIntDemo/techIntDemoRange";
import { TextareaDemo } from "@/components/modules/playground/demos/textareaDemo";
import { ToastDemo } from "@/components/modules/playground/demos/toastDemo";
import { ToggleDemo } from "@/components/modules/playground/demos/toggleDemo";
import { ToggleGroupDemo } from "@/components/modules/playground/demos/toggleGroupDemo";
import { TooltipDemo } from "@/components/modules/playground/demos/tooltipDemo";
import { Note } from "@/components/ui/note";

export default function RadixUiPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="font-metal-mania font-semibold tracking-widest text-foreground text-xl sm:text-2xl transition-[font-size] duration-500">
        {t(($) => $.playground.title)}
      </h1>
      <Note text={t(($) => $.playground.description)} />
      <TechIntDemoRange />
      <AccordionDemo />
      <ButtonDemo />
      <CheckboxDemo />
      <ChipDemo />
      <DrawerDemo />
      <FabDemo />
      <FormDemo />
      <InputDemo />
      <LoaderDemo />
      <ModalDemo />
      <NoteDemo />
      <PopoverDemo />
      <RadioGroupDemo />
      <SelectDemo />
      <SeparatorDemo />
      <SliderDemo />
      <SortableListDemo />
      <SwitchDemo />
      <TabsDemo />
      <TextareaDemo />
      <ToastDemo />
      <ToggleDemo />
      <ToggleGroupDemo />
      <TooltipDemo />
    </div>
  );
}
