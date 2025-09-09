import classNames from "classnames";

export const DragBar = ({
  onClick,
  className,
  buttonClassName,
}: {
  onClick?: () => void;
  className?: string;
  buttonClassName?: string;
}) => {
  return (
    <div className={classNames("flex justify-center w-full mt-1", className)}>
      <button
        className={classNames(
          "h-1 rounded-full w-10 bg-opacity-50",
          buttonClassName
        )}
        onClick={onClick}
      />
    </div>
  );
};
