import type { NodeClickedEvent } from "../../core";
import { getNodeMeta } from "./inspector/config/node-meta";

const BREADCRUMB_COLLAPSE_THRESHOLD = 3;

export function Breadcrumb({
  pathFromRoot,
  onSelectNode,
  onSelectLayout,
}: {
  pathFromRoot: NodeClickedEvent[];
  onSelectNode: (entry: NodeClickedEvent) => void;
  onSelectLayout: () => void;
}) {
  if (pathFromRoot.length === 0) {
    return null;
  }

  const isCollapsed = pathFromRoot.length > BREADCRUMB_COLLAPSE_THRESHOLD;

  const { icon: GlobalIcon } = getNodeMeta('global');

  function renderItem(
    entry: NodeClickedEvent,
    index: number,
    clickable: boolean,
  ) {
    const { icon: Icon, label } = getNodeMeta(entry.nodeType);
    if (clickable) {
      return (
        <button
          type="button"
          onClick={() => onSelectNode(entry)}
          className="group flex items-center gap-2 cursor-pointer"
          aria-label={`Select ${label}`}
        >
          {/* <Text */}
          {/*   className="truncate transition-colors group-hover:text-gray-10" */}
          {/*   color="gray" */}
          {/* > */}
          {label}
          {/* </Text> */}
        </button>
      );
    }

    return (
      <div
        className="flex items-center gap-1.5"
        key={`${entry.nodePos.pos}-${index}`}
      >
        <Icon className="size-4 shrink-0 text-gray-11" aria-hidden />
        {/* <Text color="white" weight="bold" size="2" className="truncate"> */}
        {label}
        {/* </Text> */}
      </div>
    );
  }

  if (isCollapsed) {
    const root = pathFromRoot[0];
    const parent = pathFromRoot[pathFromRoot.length - 2];
    const current = pathFromRoot[pathFromRoot.length - 1];
    return (
      <div className="flex items-center gap-1 flex-wrap min-w-0">
        {renderItem(root, 0, true)}
        <Text className="text-gray-8">/</Text>
        <Text className="text-gray-8" aria-hidden>
          ...
        </Text>
        <Text className="text-gray-8">/</Text>
        {renderItem(parent, pathFromRoot.length - 2, true)}
        <Text className="text-gray-8">/</Text>
        {renderItem(current, pathFromRoot.length - 1, false)}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 flex-wrap min-w-0">
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            onClick={onSelectLayout}
            className="group flex items-center gap-2 cursor-pointer"
            aria-label="Select layout"
          >
            <GlobalIcon className="size-4 text-gray-9 transition-colors group-hover:text-gray-10" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content>Layout</Tooltip.Content>
      </Tooltip.Root>

      <Text className="text-gray-8">/</Text>

      {pathFromRoot.map((entry, index, arr) => {
        const isLast = index === arr.length - 1;

        if (isLast) {
          return renderItem(entry, index, false);
        }

        return (
          <React.Fragment key={`${entry.nodePos.pos}-${index}`}>
            {renderItem(entry, index, true)}
            {/* <Text color="gray" className="text-gray-8"> */}/{/* </Text> */}
          </React.Fragment>
        );
      })}
    </div>
  );
}
