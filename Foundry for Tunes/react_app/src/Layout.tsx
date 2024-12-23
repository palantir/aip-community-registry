import React from "react";
import palantirLogo from "../public/palantir.svg";
import reactLogo from "../public/react.svg";
import css from "./Layout.module.css";

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <div>
        <a
          href="https://www.palantir.com/docs/foundry/ontology-sdk/overview/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={palantirLogo} className={css.logo} alt="Palantir logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className={css.logo} alt="React logo" />
        </a>
      </div>
      {children}
    </>
  );
}

export default Layout;
