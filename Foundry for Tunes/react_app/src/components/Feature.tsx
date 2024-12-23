import React from "react";
import classNames from "classnames";

export const Feature = ({
  title,
  text,
  last,
  reverse,
  icon: Icon,
}: {
  title: string;
  text: string;
  last?: boolean;
  reverse?: boolean;
  icon: (props: React.SVGAttributes<SVGElement>) => JSX.Element;
}) => {
  return (
    <div
      className={classNames(
        "flex items-center flex-col pb-10",
        last ? "" : "border-b mb-10 border-gray-400 dark:border-gray-600 ",
        reverse ? "sm:flex-row-reverse" : "sm:flex-row"
      )}
    >
      <div
        className={classNames(
          "sm:w-32 sm:h-32 h-20 w-20 inline-flex items-center justify-center rounded-full bg-purple-200 dark:bg-gray-900 text-purple-500 flex-shrink-0",
          reverse ? "sm:ml-10" : "sm:mr-10"
        )}
      >
        <Icon className="sm:w-16 sm:h-16 w-10 h-10" />
      </div>
      <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
        <h2 className="text-gray-800 dark:text-gray-200 text-lg title-font font-bold mb-2">
          {title}
        </h2>
        <p className="leading-relaxed text-gray-600 dark:text-gray-300 text-sm">
          {text}
        </p>
        {/* <a className="mt-3 text-indigo-500 inline-flex items-center">Learn More →</a> */}
      </div>
    </div>
  );
};
