import React from "react";
import classNames from "classnames";
import { field } from "../classes";
import { HiChevronDown } from "react-icons/hi";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export interface SelectProps<T extends string> {
  className?: string;
  options: Array<SelectOption<T>>;
  selected: T | undefined;
  onSelect: (value: T) => void;
  label?: string;
  selectRef?: React.Ref<HTMLSelectElement>;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const Select = function <T extends string>({
  className,
  options,
  selected,
  onSelect,
  label,
  selectRef,
  onBlur,
  onFocus,
}: SelectProps<T>) {
  return (
    <label className="block">
      {label && <span className={classNames("mb-1")}>{label}</span>}

      <div className="relative">
        <select
          ref={selectRef}
          value={selected}
          onChange={(v) => {
            onSelect(v.target.value as T);
          }}
          className={classNames("appearance-none mt-1 block w-full", className, field())}
          onBlur={onBlur}
          onFocus={onFocus}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 mr-3 flex flex-col justify-center">
          <HiChevronDown className="h-4 w-4" />
        </div>
      </div>
    </label>
  );
};
