import { MdMusicNote } from "react-icons/md";
import { useUser } from "../auth";
import { link } from "../classes";
import { Link } from "../components/Link";
import { LogoNText } from "../components/LogoNText";
import { isMobile } from "../utils";
import { AccountDropdown } from "../sections/AccountDropdown";
import { Button } from "../components/Button";
import { auth } from "../client";
import { navigateTo, useNavigator } from "../routes";

export const Toolbar = () => {
  const { user } = useUser();
  const { routeId } = useNavigator("hero"); // just because you need to pass in a route

  return (
    <div className="flex bg-gray-900 items-center h-16 px-3 sm:px-5 flex-shrink-0 space-x-2">
      <Link
        route="hero"
        className="flex items-center space-x-2 focus:outline-none border border-transparent focus:border-gray-600 rounded"
        label={
          <LogoNText
            className="space-x-2"
            logoClassName="w-6 h-6 text-purple-500"
            textClassName="sm:text-2xl text-xl tracking-wider text-white"
          />
        }
      />
      {user && <div className="text-purple-500 text-2xl">|</div>}
      {user && (
        <Link
          route="home"
          className={link({ color: "text-white hover:text-purple-400" })}
          label={
            <div className="space-x-1">
              <span>App</span>
              <MdMusicNote className="inline text-purple-500" />
            </div>
          }
        />
      )}
      <div className="flex-grow" />
      {!user ? (
        <div className="flex space-x-2 items-center sm:text-base text-sm">
          <Button
            theme="purple"
            invert={true}
            label="Login"
            onClick={async () => {
              await auth.signIn();
              if (routeId === "hero") navigateTo("home");
            }}
          />
        </div>
      ) : isMobile() ? null : (
        <AccountDropdown />
      )}
    </div>
  );
};
