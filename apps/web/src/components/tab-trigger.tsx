import { motion } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import classNames from "classnames";

export const TabTrigger = ({
  value,
  activeView,
  children,
  layoutId
}: {
  value: string;
  activeView: string;
  layoutId: string;
  children: React.ReactNode;
}) => (
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
        layoutId={layoutId}
        transition={{
          type: "spring",
          bounce: 0.18,
          duration: 0.6,
        }}
      />
    )}
    {children}
  </Tabs.Trigger>
);
