import { ReactNode } from "react";
import classNames from "classnames";

export const Sidebar = (props: {
  children?: ReactNode;
  sidebar: JSX.Element;
  className?: string;
}) => {
  // FIXME slide menu https://github.com/negomi/react-burger-menu
  return (
    <div className={classNames("flex", props.className)}>
      <div>{props.sidebar}</div>
      <div className="flex-grow relative">{props.children}</div>
    </div>
  );
};
