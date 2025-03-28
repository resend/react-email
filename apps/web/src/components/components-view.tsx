import type { ImportedComponent } from '../app/components/get-imported-components-for';
import { ComponentView } from './component-view';

interface ComponentsViewProps {
  components: ImportedComponent[];
}

export const ComponentsView: React.FC<ComponentsViewProps> = ({
  components,
}) => {
  return (
    <>
      {components.map((component, index) => (
        <ComponentView
          className={index !== 0 ? 'border-slate-4 border-t pt-4' : ''}
          component={component}
          key={component.slug}
        />
      ))}
    </>
  );
};
