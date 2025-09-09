import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
  Ref,
  useState,
} from "react";
import { useIsMounted } from "../utils";
import { button, ButtonTheme } from "../classes";

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label?: ReactNode;
  theme?: ButtonTheme;
  invert?: boolean;
  height?: string;
  buttonRef?: Ref<HTMLButtonElement>;
}

export const Button = ({
  invert,
  theme = "purple",
  height = "h-10",
  onClick,
  buttonRef,
  className,
  ...props
}: ButtonProps) => {
  const [loading, setLoading] = useState(false);
  const isMounted = useIsMounted();

  return (
    <button
      {...props}
      ref={buttonRef}
      className={button({ className, theme, invert })}
      onClick={async (e) => {
        if (!onClick) return;
        try {
          setLoading(true);
          await onClick(e);
        } finally {
          isMounted.current && setLoading(false);
        }
      }}
      disabled={theme === "disabled" || loading}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {props.label}
    </button>
  );
};
