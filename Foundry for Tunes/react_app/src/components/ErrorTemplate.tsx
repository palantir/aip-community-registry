import classNames from "classnames";
import { FaExclamationCircle } from "react-icons/fa";
// import { ExclamationCircle } from "@graywolfai/react-heroicons";

export interface ErrorTemplateProps {
  text?: string;
  className?: string;
}

/**
 * A generic error template to fit all your needs :)
 */
export const ErrorTemplate = (props: ErrorTemplateProps) => {
  return (
    <div
      role="alert"
      className={classNames(
        props.className,
        "flex flex-col justify-center items-center h-full space-y-2"
      )}
    >
      <FaExclamationCircle className="h-10 w-10 text-red-400" />
      <div className="text-gray-500">
        {props.text ??
          "Your error has been noted and will hopefully be resolved soon 😔"}
      </div>
    </div>
  );
};
