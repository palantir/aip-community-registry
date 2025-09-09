import { Switch as HeadlessSwitch } from "@headlessui/react";
import classNames from "classnames";

export interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  // Use "big" on mobile
  size?: "big" | "small";
}

const SwitchComponent = ({
  checked,
  onChange,
  size = "small",
}: SwitchProps) => {
  return (
    <HeadlessSwitch
      as="button"
      checked={checked}
      onChange={onChange}
      style={size === "big" ? { width: "3.5rem" } : { width: "2.75rem" }}
      className={classNames(
        checked ? "bg-purple-500" : "bg-gray-300",
        size === "big" ? "h-8" : "h-6",
        "relative inline-flex transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer focus:outline-none focus:ring"
      )}
    >
      {({ checked }) => (
        <span
          className={classNames(
            checked
              ? size === "big"
                ? "translate-x-6"
                : "translate-x-5"
              : "translate-x-0",
            "inline-block transition duration-200 ease-in-out transform bg-white rounded-full"
          )}
          style={
            size === "big"
              ? { width: "1.75rem", height: "1.75rem" }
              : { width: "1.25rem", height: "1.25rem" }
          }
        />
      )}
    </HeadlessSwitch>
  );
};

export const Switch = Object.assign(SwitchComponent, {
  Group: HeadlessSwitch.Group,
  Label: HeadlessSwitch.Label,
});
