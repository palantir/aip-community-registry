import classNames from "classnames";
import { HiX } from "react-icons/hi";
import { IconType } from "react-icons/lib";
import { button } from "../classes";
import { Button } from "./Button";
import { IconButton } from "./IconButton";

export interface BannerProps {
  onClose?: () => void;
  text?: React.ReactNode;
  onClick?: () => Promise<void> | void;
  href?: string;
  icon?: IconType;
  label?: React.ReactNode;
}

export const Banner = ({
  onClose,
  text,
  onClick,
  icon: Icon,
  label,
  href,
}: BannerProps) => {
  return (
    <div className="bg-purple-700">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap text-sm">
          <div className="w-0 flex-1 flex items-center">
            {Icon && (
              <span className="p-2 rounded-lg bg-purple-800">
                <Icon className="h-6 w-6 text-white" />
              </span>
            )}
            <div
              className={classNames(
                Icon && "ml-3",
                "font-medium text-white truncate"
              )}
            >
              {text}
            </div>
          </div>
          {href ? (
            <a
              target="_blank"
              rel="noreferrer"
              href={href}
              className={button({ theme: "white" })}
            >
              {label}
            </a>
          ) : (
            label && <Button label={label} theme="white" onClick={onClick} />
          )}
          {onClose && (
            <IconButton
              className="w-4 h-4"
              icon={HiX}
              title="Close the banner"
              onClick={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};
