import { auth } from "../client";
import { useDefinedUser } from "../auth";
import { link } from "../classes";
import { Switch } from "../components/Switch";
import { useDarkMode } from "../dark";
import { navigateTo } from "../routes";
import { PROD_WEB_ADDR } from "../constants";

export const Settings = () => {
  const user = useDefinedUser();
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <div className="mx-5 flex-grow my-5 p-safe-bottom flex flex-col space-y-3">
      <div className="text-sm">
        {`Signed in as `} <span className="font-bold">{user.email}</span>
      </div>

      <Switch.Group
        as="div"
        className="flex items-center space-x-4 justify-between w-full"
      >
        <Switch.Label className="text-sm flex items-center space-x-2">
          <span>Dark Mode</span>
        </Switch.Label>
        <Switch checked={darkMode} onChange={setDarkMode} size="big" />
      </Switch.Group>

      <div className="flex items-center space-x-2">
        <span className="text-sm">Have any feedback?</span>
        <div className="flex-grow" />
        <button
          className="px-3 py-1 bg-purple-500 text-white rounded border-b-2 border-purple-700 shadow-sm uppercase"
          onClick={() => navigateTo("feedback")}
        >
          Feedback Form
        </button>
      </div>

      {import.meta.env?.MODE !== "production" && (
        <button
          className="px-3 py-2 bg-purple-500 text-white rounded border-b-2 border-purple-700 shadow-sm uppercase"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      )}

      <div className="flex-grow" />
      <button
        className="w-full px-3 py-2 bg-purple-500 text-white rounded border-b-2 border-purple-700 shadow-sm uppercase"
        onClick={() => auth.signOut()}
      >
        Logout
      </button>
      <p className="text-center text-xs">
        Use our desktop web app @{" "}
        <a
          href={PROD_WEB_ADDR}
          target="_blank"
          rel="noreferrer"
          className={link()}
        >
          {PROD_WEB_ADDR}
        </a>{" "}
        to manage your account.
      </p>
    </div>
  );
};

export default Settings;
