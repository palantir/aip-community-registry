import classNames from "classnames";

export type ButtonTheme = "purple" | "red" | "none" | "disabled" | "white";

const classes: { [K in ButtonTheme]: { default: string; invert: string } } = {
  purple: {
    default:
      "border-transparent bg-purple-600 text-white focus:bg-purple-500 hover:bg-purple-500 focus:border-purple-700",
    invert: "text-white border-purple-500 text-white",
  },
  red: {
    default:
      "border-transparent bg-red-600 text-white focus:bg-red-500 hover:bg-red-500 focus:border-red-700",
    invert: "text-white border-red-500",
  },
  none: {
    default: classNames(
      "border-gray-300 bg-white text-gray-700 focus:bg-gray-100 hover:bg-gray-100 focus:border-gray-500",
      "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
    ),
    invert: "text-white border-gray-100",
  },
  disabled: {
    default: classNames(
      "border-gray-100 bg-gray-200 text-gray-500 cursor-not-allowed",
      "dark:bg-gray-800 dark:border-gray-700"
    ),
    invert: "text-white border-gray-100",
  },
  white: {
    default: classNames(
      "border-transparent text-indigo-600 bg-white hover:bg-indigo-50"
    ),
    invert: "text-white border-white",
  },
};

export const bgApp = "#f2f2f3";

type ButtonOptions = {
  theme?: ButtonTheme;
  invert?: boolean;
  className?: string;
};

export const button = ({
  theme = "purple",
  invert,
  className,
}: ButtonOptions = {}) => {
  return classNames(
    "flex justify-center items-center border uppercase font-medium rounded-md focus:outline-none",
    "transition duration-150 ease-in-out px-2 sm:px-4 py-2",
    invert
      ? classNames("bg-transparent", classes[theme].invert)
      : classNames("focus:outline-none", classes[theme].default),
    className
  );
};

export const link = ({ color = "text-blue-500 dark:text-blue-400" } = {}) => {
  return classNames(
    color,
    "cursor-pointer hover:underline focus:underline focus:outline-none"
  );
};

export const field = () => {
  return "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 px-3 py-2 rounded border border-gray-200 focus:ring-2 focus:outline-none";
};
