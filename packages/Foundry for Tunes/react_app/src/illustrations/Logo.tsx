import classNames from "classnames";
import * as React from "react";

export function Logo({ className, ...rest }: React.SVGAttributes<SVGElement>) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        {...rest}
        className={className}
      >
        {/* <!-- Inner circle from the Palantir logo, moved down --> */}
        <circle
          cx="12"
          cy="12"
          r="6.568"
          stroke="black"
          strokeWidth="1"
          fill="none"
        />
        <path d="M437.02 74.98C388.667 26.629 324.38 0 256 0S123.333 26.629 74.98 74.98C26.629 123.333 0 187.62 0 256s26.629 132.667 74.98 181.02C123.333 485.371 187.62 512 256 512s132.667-26.629 181.02-74.98C485.371 388.667 512 324.38 512 256s-26.629-132.667-74.98-181.02zM120 280c0 13.255-10.745 24-24 24s-24-10.745-24-24v-48c0-13.255 10.745-24 24-24s24 10.745 24 24zm80 40c0 13.255-10.745 24-24 24s-24-10.745-24-24V192c0-13.255 10.745-24 24-24s24 10.745 24 24zm80 48c0 13.255-10.745 24-24 24s-24-10.745-24-24V144c0-13.255 10.745-24 24-24s24 10.745 24 24zm80-48c0 13.255-10.745 24-24 24s-24-10.745-24-24V192c0-13.255 10.745-24 24-24s24 10.745 24 24zm56-16c-13.255 0-24-10.745-24-24v-48c0-13.255 10.745-24 24-24s24 10.745 24 24v48c0 13.255-10.745 24-24 24z" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        stroke="currentColor"
        {...rest}
        className={classNames(className, "absolute bottom-0 overflow-visible")}
        style={{
          transform: "translate(0, 30%)",
        }}
      >
        <path d="M20.147 18L12 21.178 3.853 18 2.5 20.343 12 24l9.5-3.657L20.147 18z" />
      </svg>
    </div>
  );
}
