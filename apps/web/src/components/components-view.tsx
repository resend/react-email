"use client";
import { useEffect, useState } from "react";
import type {
  CodeVariant,
  ImportedComponent,
} from "../app/components/get-components";
import { ComponentView } from "./component-view";

interface ComponentsViewProps {
  components: RenderedComponent[];
}

export type RenderedComponent = Omit<ImportedComponent, "element"> & {
  html: string;
};

export const ComponentsView: React.FC<ComponentsViewProps> = ({
  components,
}) => {
  const [selectedCodeVariant, setSelectedCodeVariant] =
    useState<CodeVariant>("tailwind");

  useEffect(() => {
    if (localStorage.getItem("code-variant") === "inline-styles") {
      setSelectedCodeVariant("inline-styles");
    }
  }, []);

  return (
    <>
      {components.map((component, index) => (
        <ComponentView
          className={index !== 0 ? "border-t border-zinc-900 pt-4" : ""}
          codeVariant={selectedCodeVariant}
          component={component}
          key={component.slug}
          onChangeCodeVariant={(v) => {
            setSelectedCodeVariant(v);
            localStorage.setItem("code-variant", v);
          }}
        />
      ))}
    </>
  );
};
