import classNames from "classnames";
import { link } from "../classes";

export interface LinkButton {
  label: string;
  onClick: () => void;
  className?: string;
}

export const LinkButton = ({ label, onClick, className }: LinkButton) => {
  return (
    <button className={classNames(link(), className)} onClick={onClick}>
      {label}
    </button>
  );
};
