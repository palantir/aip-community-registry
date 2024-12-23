import React from "react";

export const HeartBeat = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>
  );
};
