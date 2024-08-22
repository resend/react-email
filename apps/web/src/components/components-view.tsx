import type { ImportedComponent } from "../app/components/get-components";
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
  return (
    <>
      {components.map((component, index) => (
        <ComponentView
          className={index !== 0 ? "border-t border-slate-4 pt-4" : ""}
          component={component}
          key={component.slug}
        />
      ))}
    </>
  );
};
