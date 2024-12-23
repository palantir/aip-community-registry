import classNames from "classnames";

export const Shortcut = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <span
      className={classNames(
        className,
        "px-2 bg-purple-600 text-white rounded uppercase leading-none border-b-2 py-1 border-purple-800"
      )}
    >
      {text}
    </span>
  );
};
