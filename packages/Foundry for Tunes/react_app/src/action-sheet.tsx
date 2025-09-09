import { useEffect, useState } from "react";
import { IconType } from "react-icons/lib";
import { createEmitter } from "./events";
import classNames from "classnames";
import { Link } from "./components/Link";
import { NavigatorRoutes } from "./routes";
import { isDefined } from "./shared/utils";

export type ActionSheetItem<
  K extends keyof NavigatorRoutes = keyof NavigatorRoutes,
> = {
  label: string;
  icon: IconType;
} & (
  | {
      type: "click";
      onClick: () => void;
    }
  | {
      type: "link";
      route: K;
      params?: NavigatorRoutes[K]["params"];
      onGo?: () => void;
    }
);

const emitter = createEmitter<{
  show: [Array<ActionSheetItem | undefined>];
}>();

export function openActionSheet(items: Array<ActionSheetItem | undefined>) {
  emitter.emit("show", items);
}

export const ActionSheet = () => {
  const [items, setItems] = useState<ActionSheetItem[]>();
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    return emitter.on("show", (items) => {
      const filtered = items.filter(isDefined);
      if (filtered.length === 0) return;
      setItems(filtered);
      setDisplay(true);
    });
  }, []);

  return (
    <>
      <div
        className={classNames(
          "fixed inset-0 bg-gray-800 z-40 transition-opacity duration-300",
          display ? "opacity-50" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setDisplay(false)}
      />
      <div
        className={classNames(
          "fixed bg-gray-100 dark:bg-gray-900 shadow bottom-0 inset-x-0 z-50 divide-y",
          "transition-transform transform duration-300 rounded-t-lg text-gray-800",
          "dark:text-gray-200 divide-gray-300 dark:divide-gray-700 p-safe-bottom",
          display ? "translate-y-0" : "translate-y-full"
        )}
        onTransitionEnd={() => !display && setItems(undefined)}
      >
        {items?.map((item) => {
          const children = (
            <>
              <item.icon className="w-5 h-5" />
              <div>{item.label}</div>
            </>
          );
          return item.type === "click" ? (
            <div
              key={item.label}
              className="flex px-2 py-3 space-x-3"
              onClick={() => {
                setDisplay(false);
                item.onClick();
              }}
            >
              {children}
            </div>
          ) : (
            <Link
              label={children}
              key={item.label}
              route={item.route}
              params={item.params}
              className="flex px-2 py-3 space-x-3"
              onGo={() => {
                setDisplay(false);
                item.onGo && item.onGo();
              }}
            />
          );
        })}
      </div>
    </>
  );
};
