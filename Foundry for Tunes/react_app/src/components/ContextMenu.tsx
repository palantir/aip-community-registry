import React, { useRef } from "react";
import type { IconType } from "react-icons/lib";
import classNames from "classnames";
import useDropdownMenu from "react-accessible-dropdown-menu-hook";

// FIXME use headless

export interface ItemProps {
  onKeyDown: (e: React.KeyboardEvent<HTMLAnchorElement>) => void;
  tabIndex: number;
  role: string;
  ref: React.RefObject<HTMLAnchorElement>;
}

export interface ContextMenuItem {
  icon: IconType;
  label: string;
  onClick: () => void;
  // props: ItemProps;
}

interface ButtonProps<ButtonElement extends HTMLElement>
  extends Pick<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<ButtonElement>,
      ButtonElement
    >,
    | "onKeyDown"
    | "onClick"
    | "tabIndex"
    | "role"
    | "aria-haspopup"
    | "aria-expanded"
  > {
  ref: React.RefObject<ButtonElement>;
}

export interface ContextMenuProps {
  className?: string;
  menuClassName?: string;
  items: ContextMenuItem[];
  button: (props: ButtonProps<HTMLButtonElement>) => JSX.Element;
}

export const ContextMenu = ({
  className,
  items,
  button,
  menuClassName,
}: ContextMenuProps) => {
  const { buttonProps, itemProps, setIsOpen, isOpen } = useDropdownMenu(
    items.length
  );

  const buttonElement = useRef(
    button({
      ...buttonProps,
      onClick: (e) => {
        e.stopPropagation();
        buttonProps.onClick && buttonProps.onClick(e as any);
        setIsOpen(true);
      },
    })
  );

  return (
    <>
      {buttonElement.current}
      <div className={classNames("relative", className)}>
        <div
          className={classNames(
            isOpen ? "display" : "hidden",
            "absolute flex flex-col shadow divide-y dark:divide-gray-800 bg-white dark:bg-gray-900 rounded",
            menuClassName
          )}
          role="menu"
        >
          {items.map((item, i) => (
            <a
              key={item.label}
              {...itemProps[i]}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick();
                setIsOpen(false);
              }}
              className={classNames(
                "p-2 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer flex items-center space-x-2",
                "dark:text-gray-200 text-gray-700"
              )}
            >
              <item.icon className="w-5 h-5" />
              <div className="">{item.label}</div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};
