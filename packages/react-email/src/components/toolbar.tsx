"use client";
import * as Tabs from "@radix-ui/react-tabs";
import { use, useEffect } from "react";
import { PreviewContext } from "../contexts/preview";
import { Linter, type LintingRow, useLinter } from "./toolbar/linter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGroup } from "framer-motion";
import { cn } from "../utils";
import { IconArrowDown } from "./icons/icon-arrow-down";
import { IconReload } from "./icons/icon-reload";
import { IconScanner } from "./icons/icon-scanner";
import { IconScissors } from "./icons/icon-scissors";
import { ToolbarButton } from "./toolbar/toolbar-button";
import {
  SpamAssassin,
  useSpamAssassin,
  type SpamCheckingResult,
} from "./toolbar/spam-assassin";
import { isBuilding } from "../app/env";

export type ToolbarTabValue = "linter" | "spam-assassin";

interface ToolbarProps {
  serverSpamCheckingResult: SpamCheckingResult | undefined;
  serverLintingRows: LintingRow[] | undefined;
}

export const Toolbar = ({
  serverLintingRows,
  serverSpamCheckingResult,
}: ToolbarProps) => {
  const { emailPath, emailSlug, renderedEmailMetadata } = use(PreviewContext)!;

  if (!renderedEmailMetadata) return null;
  const { markup, plainText, reactMarkup } = renderedEmailMetadata;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = (searchParams.get("toolbar-panel") ?? undefined) as
    | ToolbarTabValue
    | undefined;

  const toggled = activeTab !== undefined;

  const setActivePanelValue = (newValue: ToolbarTabValue | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (newValue === undefined) {
      params.delete("toolbar-panel");
    } else {
      params.set("toolbar-panel", newValue);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const [spamCheckingResult, { load: loadSpamChecking }] = useSpamAssassin({
    slug: emailSlug,
    markup,
    plainText,

    initialResult: serverSpamCheckingResult,
  });

  const [lintingResults, { load: loadLinting }] = useLinter({
    slug: emailSlug,
    reactMarkup,
    emailPath,
    markup,

    initialRows: serverLintingRows,
  });

  if (!isBuilding) {
    useEffect(() => {
      loadLinting();
      loadSpamChecking();
    }, []);
  }

  return (
    <div
      data-toggled={toggled}
      className={cn(
        "bg-black group/toolbar text-xs text-slate-11 h-48 transition-all",
        "data-[toggled=false]:h-8",
      )}
    >
      <Tabs.Root
        value={activeTab}
        onValueChange={(newValue) => {
          setActivePanelValue(newValue as ToolbarTabValue);
        }}
        asChild
      >
        <div className="flex flex-col h-full">
          <Tabs.List className="flex gap-4 px-2 border-b border-solid border-slate-6 h-7 w-full">
            <LayoutGroup id="toolbar">
              <Tabs.Trigger asChild value="spam-assassin">
                <ToolbarButton active={activeTab === "spam-assassin"}>
                  <IconScissors />
                  Spam Assassin
                </ToolbarButton>
              </Tabs.Trigger>
              <Tabs.Trigger asChild value="linter">
                <ToolbarButton active={activeTab === "linter"}>
                  <IconScanner />
                  Linter
                </ToolbarButton>
              </Tabs.Trigger>
            </LayoutGroup>
            <div className="flex gap-1 ml-auto">
              {isBuilding ? null : (
                <ToolbarButton
                  tooltip="Reload"
                  onClick={async () => {
                    if (activeTab === undefined) {
                      setActivePanelValue("linter");
                    }
                    if (activeTab === "spam-assassin") {
                      await loadSpamChecking();
                    } else {
                      await loadLinting();
                    }
                  }}
                >
                  <IconReload />
                </ToolbarButton>
              )}
              <ToolbarButton
                tooltip="Toggle toolbar"
                onClick={() => {
                  if (activeTab === undefined) {
                    setActivePanelValue("linter");
                  } else {
                    setActivePanelValue(undefined);
                  }
                }}
              >
                <IconArrowDown className="transition-transform group-data-[toggled=false]/toolbar:rotate-180" />
              </ToolbarButton>
            </div>
          </Tabs.List>

          <div className="flex-grow transition-opacity opacity-100 group-data-[toggled=false]/toolbar:opacity-0 overflow-y-auto px-2">
            <Tabs.Content value="linter">
              <Linter rows={lintingResults} />
            </Tabs.Content>
            <Tabs.Content value="spam-assassin">
              <SpamAssassin result={spamCheckingResult} />
            </Tabs.Content>
          </div>
        </div>
      </Tabs.Root>
    </div>
  );
};
