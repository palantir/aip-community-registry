import classNames from "classnames";
import { LogoNText } from "./LogoNText";
import { ReactNode } from "react";

export interface CardPageProps {
  children?: ReactNode;
  footer?: ReactNode;
  cardClassName?: string;
  verticallyCenter?: boolean;
}

export const CardPage = ({
  children,
  footer,
  cardClassName,
  verticallyCenter,
}: CardPageProps) => {
  return (
    // It's important that we only justify things to the center of the screen vertically so that
    // on mobile, when the keyboard comes up, it doesn't block the input
    <div
      className={classNames(
        "flex flex-col items-center text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 md:bg-transparent w-full flex-grow overflow-y-scroll",
        verticallyCenter && "sm:justify-center"
      )}
    >
      {/* CARD */}
      <div
        className={classNames(
          "md:shadow-xl rounded-lg px-6 bg-white dark:bg-gray-900 w-full max-w-sm space-y-4",
          "py-4 border-transparent md:border dark:border-gray-700 my-5",
          cardClassName
        )}
      >
        <LogoNText
          logoClassName="w-10 h-10"
          textClassName="text-5xl"
          className="space-x-3 mt-6"
        />
        {children}

        {footer && <div className="h-4"></div>}
        <div className="h-16 border-t border-gray-500">{footer}</div>
      </div>
    </div>
  );
};
