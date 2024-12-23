import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom";

export interface PortalProps extends React.HTMLAttributes<HTMLDivElement> {
  onOutClick: () => void;
}

/**
 * Creates a portal to the root of the document.
 */
export const Portal = (props: PortalProps) => {
  const [node] = useState(document.createElement("div"));
  const { onOutClick, ...divProps } = props;
  const root = useRef<HTMLDivElement>(null);

  const handleOutClick = useCallback(
    (e: MouseEvent) => {
      if (typeof onOutClick === "function") {
        if (root.current && !root.current.contains(e.target as any)) {
          onOutClick();
        }
        if (!root.current) {
          onOutClick();
        }
      }
    },
    [onOutClick],
  );

  useEffect(() => {
    document.body.appendChild(node);
    return () => {
      document.body.removeChild(node);
    };
  }, [node]);

  useEffect(() => {
    document.addEventListener("click", handleOutClick, true);
    return () => document.removeEventListener("click", handleOutClick, true);
  });

  return ReactDOM.createPortal(
    <div ref={root} {...divProps} onClick={onOutClick}>
      {props.children}
    </div>,
    node,
  );
};
