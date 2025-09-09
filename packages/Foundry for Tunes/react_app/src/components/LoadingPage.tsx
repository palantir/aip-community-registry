import classNames from "classnames";
import { LoadingSpinner } from "./LoadingSpinner";

export const LoadingPage = ({ className }: { className?: string }) => (
  <LoadingSpinner
    className={classNames(className, "bg-white dark:bg-gray-900")}
  />
);
