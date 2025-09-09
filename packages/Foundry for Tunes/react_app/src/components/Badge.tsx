import classNames from "classnames";

export const Badge = ({ className }: { className?: string }) => {
  return (
    <div
      className={classNames(
        "bg-purple-500 w-3 h-3 rounded-full absolute right-0 top-0 transform",
        className
      )}
    ></div>
  );
};
