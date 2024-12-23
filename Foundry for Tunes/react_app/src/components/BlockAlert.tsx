import classNames from "classnames";
import { ReactNode } from "react";

export interface BlockAlertsProps {
  children: ReactNode;
  type?: "info" | "warn" | "error" | "success";
  className?: string;
}

const classes = {
  info: "border-blue-400 bg-blue-200 text-blue-700",
  warn: "border-yellow-400 bg-yellow-200 text-yellow-700",
  error: "border-red-400 bg-red-200 text-red-700",
  success: "border-green-400 bg-green-200 text-green-700",
};

export const BlockAlert = ({
  className,
  children,
  type = "info",
}: BlockAlertsProps) => {
  return (
    <div
      className={classNames(
        className,
        "text-sm p-3 border-2 rounded-lg",
        classes[type]
      )}
    >
      {children}
    </div>
  );
};
