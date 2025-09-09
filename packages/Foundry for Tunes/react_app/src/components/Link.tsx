import React, { forwardRef, useMemo } from "react";
import classNames from "classnames";
import { link } from "../classes";
import { navigateTo, NavigatorRoutes, routes } from "../routes";

export interface LinkProps<K extends keyof NavigatorRoutes> {
  className?: string;
  route: K;
  label?: React.ReactNode;
  queryParams?: NavigatorRoutes[K]["queryParams"];
  params?: NavigatorRoutes[K]["params"];
  onGo?: () => void;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

// eslint-disable-next-line react/display-name
export const Link = forwardRef<
  HTMLAnchorElement,
  LinkProps<keyof NavigatorRoutes>
>(
  ({ route, label, className, params, queryParams, onGo, onClick }, ref) => {
    const href = useMemo(() => {
      let href = routes[route].path;
      Object.entries(params ?? {}).forEach(([key, value]) => {
        // the ?? is just to satisfy
        href = href.replace(`:${key}`, value as string);
      });

      if (queryParams) {
        const search = Object.entries(queryParams)
          .map(([key, value]) => `${key}=${value}`)
          .join("&");

        href = href + "?" + search;
      }

      return href;
    }, [route, params, queryParams]);

    return (
      <a
        ref={ref}
        href={href}
        className={classNames(className ?? link())}
        onClick={(e) => {
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            // This is important since if there are any onClick listeners above this
            // they won't be triggered which is *probably* ideal behavior
            e.stopPropagation();
            navigateTo(route, params, queryParams);
            onGo && onGo();
          }

          // e.stopPropagation();
          onClick && onClick(e);
        }}
      >
        {label}
      </a>
    );
  }
  // Cast since it's not possible to use generics with forwardRef
  // See https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
) as <K extends keyof NavigatorRoutes>(props: LinkProps<K>) => JSX.Element;
