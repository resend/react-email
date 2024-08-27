"use client";

import * as React from "react";
import classNames from "classnames";
import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardIcon,
} from "lucide-react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import type { CodeVariant } from "../app/components/get-components";
import { ComponentPreview } from "./component-preview";
import { CodeBlock } from "./code-block";
import type { RenderedComponent } from "./components-view";
import { Tooltip } from "./tooltip";
import { IconMonitor } from "./icons/icon-monitor";
import { IconPhone } from "./icons/icon-phone";
import { IconSource } from "./icons/icon-source";

interface ComponentViewProps {
  component: RenderedComponent;
  className?: string;
}

type ActiveView = "code" | "desktop" | "mobile";

const TabTrigger: React.FC<{
  value: ActiveView;
  activeView: ActiveView;
  icon: React.ReactNode;
  tooltip: string;
}> = ({ value, activeView, icon, tooltip }) => (
  <Tooltip>
    <Tooltip.Trigger asChild>
      <Tabs.Trigger
        className={classNames(
          "group relative scroll-m-2 rounded-md px-3 py-1.5 focus:outline-none",
          {
            "text-slate-11": activeView !== value,
            "text-slate-12": activeView === value,
          },
        )}
        style={{ WebkitTapHighlightColor: "transparent" }}
        tabIndex={0}
        value={value}
      >
        {activeView === value && (
          <motion.span
            className="pointer-events-none absolute inset-0 z-[2] rounded-md bg-slate-6 group-focus:outline-none group-focus:ring group-focus:ring-slate-3"
            initial={false}
            layoutId="tab-bubble"
            transition={{
              type: "spring",
              bounce: 0.18,
              duration: 0.6,
            }}
          />
        )}
        {icon}
      </Tabs.Trigger>
    </Tooltip.Trigger>
    <Tooltip.Content>{tooltip}</Tooltip.Content>
  </Tooltip>
);

const TabContent: React.FC<{
  value: ActiveView;
  children: React.ReactNode;
  additionalClasses?: string;
}> = ({ value, children, additionalClasses = "" }) => (
  <Tabs.Content
    className={`relative m-4 mx-2 h-fit scroll-m-2 overflow-hidden rounded-md border border-slate-4 transition-colors focus:outline-none focus:ring focus:ring-slate-8 md:mx-8 ${additionalClasses}`}
    value={value}
  >
    {children}
  </Tabs.Content>
);

export const ComponentView: React.FC<ComponentViewProps> = ({
  component,
  className,
}) => {
  const [activeView, setActiveView] = React.useState<ActiveView>("desktop");
  const [selectedCodeVariant, setSelectedCodeVariant] =
    React.useState<CodeVariant>("tailwind");
  const [isCopied, setIsCopied] = React.useState<boolean>(false);

  React.useEffect(() => {
    setActiveView(activeView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (localStorage.getItem("code-variant") === "inline-styles") {
      setSelectedCodeVariant("inline-styles");
    }
  }, []);

  const code =
    typeof component.code === "string"
      ? component.code
      : component.code[selectedCodeVariant] ?? "";

  const onCopy = () => {
    void navigator.clipboard.writeText(code);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      onCopy();
    }
  };

  return (
    <Tabs.Root
      className="relative mb-8 flex w-full flex-col gap-2 md:mb-12"
      defaultValue={activeView}
      onValueChange={(value: string) => {
        setActiveView(value as ActiveView);
      }}
    >
      <TooltipProvider>
        <div
          className={classNames(
            "relative flex w-full items-center gap-6 px-6 pb-3 md:px-8",
            className,
          )}
        >
          <h2 className="shrink grow basis-0 text-pretty text-lg font-semibold text-slate-12 md:text-xl">
            {component.title}
          </h2>
          <Tabs.List className="relative flex w-fit items-center space-x-1 overflow-hidden p-1 text-xs">
            <TabTrigger
              activeView={activeView}
              icon={<IconMonitor />}
              tooltip="Desktop"
              value="desktop"
            />
            <TabTrigger
              activeView={activeView}
              icon={<IconPhone />}
              tooltip="Mobile"
              value="mobile"
            />
            <TabTrigger
              activeView={activeView}
              icon={<IconSource />}
              tooltip="Code"
              value="code"
            />
          </Tabs.List>
          <div className="absolute bottom-0 right-0 h-px w-[100dvw] bg-slate-4" />
        </div>
        <div className="relative h-fit w-full transition-all duration-300 ease-[cubic-bezier(.36,.66,.6,1)] [transition-behavior:allow-discrete]">
          <TabContent value="desktop">
            <div className="absolute inset-0 bg-transparent bg-[radial-gradient(#091A21_.0313rem,transparent_.0313rem),_radial-gradient(#091A21_.0313rem,transparent_.0313rem)] opacity-30 transition-all duration-300 ease-[cubic-bezier(.36,.66,.6,1)] [background-position:0_0,.625rem_.625rem] [background-size:1.25rem_1.25rem] [height:calc-size(auto)] [transition-behavior:allow-discrete]" />
            <ComponentPreview activeView="desktop" html={component.html} />
          </TabContent>
          <TabContent value="mobile">
            <div className="absolute inset-0 bg-transparent bg-[radial-gradient(#091A21_.0313rem,transparent_.0313rem),_radial-gradient(#091A21_.0313rem,transparent_.0313rem)] opacity-30 transition-all duration-300 ease-[cubic-bezier(.36,.66,.6,1)] [background-position:0_0,.625rem_.625rem] [background-size:1.25rem_1.25rem] [height:calc-size(auto)] [transition-behavior:allow-discrete]" />
            <ComponentPreview activeView="mobile" html={component.html} />
          </TabContent>
          <TabContent value="code">
            <div className="flex h-full w-full flex-col gap-2 bg-slate-3">
              <div className="relative flex w-full justify-between gap-4 border-b border-solid border-slate-4 p-4 text-xs">
                {activeView === "code" && typeof component.code === "object" ? (
                  <Select.Root
                    onValueChange={(variant: CodeVariant) => {
                      setSelectedCodeVariant(variant);
                      localStorage.setItem("code-variant", variant);
                    }}
                    value={selectedCodeVariant}
                  >
                    <Select.Trigger
                      aria-label="Choose the styling solution"
                      className="flex h-8 items-center justify-center gap-1 rounded bg-slate-3 px-3 leading-none outline-none focus-within:ring-2 focus-within:ring-slate-6 focus-within:ring-opacity-50 data-[placeholder]:text-slate-11"
                    >
                      <Select.Value>
                        {selectedCodeVariant === "tailwind"
                          ? "Tailwind CSS"
                          : "Inline CSS"}
                      </Select.Value>
                      <Select.Icon>
                        <ChevronDownIcon size={14} />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="z-[2] overflow-hidden rounded-md bg-[#1F2122]">
                        <Select.ScrollUpButton className="flex h-6 cursor-default items-center justify-center">
                          <ChevronUpIcon size={12} />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-1">
                          {Object.keys(component.code).map((variant) => (
                            <Select.Item
                              className="relative flex h-8 cursor-pointer select-none items-center rounded-[.25rem] px-6 py-2 text-xs leading-none text-slate-11 transition-colors ease-[cubic-bezier(.36,.66,.6,1)] data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-3 data-[highlighted]:text-slate-12 data-[highlighted]:outline-none"
                              key={variant}
                              value={variant}
                            >
                              <Select.ItemText>
                                {variant === "tailwind"
                                  ? "Tailwind CSS"
                                  : "Inline CSS"}
                              </Select.ItemText>
                              <Select.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center text-slate-12">
                                <CheckIcon size={10} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                ) : null}
                <button
                  aria-label="Copy code"
                  className="flex h-8 w-8 items-center justify-center rounded-sm outline-0 focus-within:ring-2 focus-within:ring-slate-6 focus-within:ring-opacity-50"
                  onClick={onCopy}
                  onKeyUp={handleKeyUp}
                  tabIndex={0}
                  type="button"
                >
                  {isCopied ? (
                    <CheckIcon size={16} />
                  ) : (
                    <ClipboardIcon size={16} />
                  )}
                </button>
              </div>
              <div className="h-full w-full overflow-auto">
                <CodeBlock language="tsx">{code}</CodeBlock>
              </div>
            </div>
          </TabContent>
        </div>
      </TooltipProvider>
    </Tabs.Root>
  );
};
