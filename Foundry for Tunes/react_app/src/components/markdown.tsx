import React from "react";
import classNames from "classnames";
import { link } from "../classes";

export const H1 = ({
  l,
  className,
  children,
}: {
  l?: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <h1 className={classNames(className, "text-4xl font-bold")}>
    {children ?? l}
  </h1>
);

export const H2 = ({
  l,
  className,
  children,
}: {
  l?: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <h2 className={classNames(className, "text-2xl font-bold mt-6")}>
    {children ?? l}
  </h2>
);

export const P = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => (
  <p
    id={id}
    className={classNames(
      "text-gray-700 dark:text-gray-300 text-sm mt-3 leading-7",
      className
    )}
  >
    {children}
  </p>
);

export const LI = ({ children }: { children: React.ReactNode }) => (
  <li className="text-sm text-gray-700 dark:text-gray-300">{children}</li>
);

export const A = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <a href={href} className={link()}>
      {children}
    </a>
  );
};
