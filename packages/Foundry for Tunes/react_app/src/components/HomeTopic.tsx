import React from "react";
import { Link } from "./Link";
import classNames from "classnames";
import { NavigatorRoutes } from "../routes";
import { isMobile } from "../utils";

export interface HomeTopicProps<K extends keyof NavigatorRoutes> {
  title: string;
  subTitle?: string;
  children: JSX.Element;
  route: K;
  params?: NavigatorRoutes[K]["params"];
  queryParams?: NavigatorRoutes[K]["queryParams"];
  emptyText?: React.ReactNode;
}

export const HomeTopic = function <K extends keyof NavigatorRoutes>({
  title,
  subTitle,
  children,
  route,
  params,
  queryParams,
}: HomeTopicProps<K>) {
  return (
    <div className="">
      <div
        className={classNames(
          "flex justify-between items-center",
          isMobile() ? "px-3" : "px-5"
        )}
      >
        <div>
          <div className="text-gray-800 dark:text-gray-200 text-xl md:text-2xl leading-tight">
            {title}
          </div>
        </div>
        <Link
          label="See All →"
          className="uppercase text-gray-700 dark:text-gray-300 hover:text-purple-700 focus:text-purple-700"
          route={route}
          params={params}
          queryParams={queryParams}
        />
      </div>
      <div
        className={classNames(
          "text-gray-500 dark:text-gray-400 text-xs",
          isMobile() ? "px-3" : "px-5"
        )}
      >
        {subTitle}
      </div>

      <div className="mt-2 lg:mt-3" style={{ minHeight: "10px" }}>
        {children}
      </div>
    </div>
  );
};
