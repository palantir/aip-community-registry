import { LogoIcon } from "./LogoIcon";

import { CSSProperties } from "react";
import classNames from "classnames";
import { NAME, NAME_SHORT } from "../constants";

export const LogoNText = ({
  className,
  textClassName,
  logoClassName,
  glitch,
  short,
  justify = "center",
  textStyle,
}: {
  className?: string;
  textClassName?: string;
  logoClassName?: string;
  glitch?: boolean;
  short?: boolean;
  justify?: "center" | "start";
  textStyle?: CSSProperties;
}) => (
  <div
    className={classNames(
      "flex items-center",
      className,
      justify === "center" ? "justify-center" : "justify-start"
    )}
  >
    <LogoIcon className={logoClassName} />
    <div
      title={NAME}
      className={classNames(textClassName, glitch && "glitch")}
      style={textStyle}
    >
      {short ? NAME_SHORT : NAME}
    </div>
  </div>
);
