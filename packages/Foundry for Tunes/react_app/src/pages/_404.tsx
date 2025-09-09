import { Link } from "../components/Link";

export const _404 = () => {
  return (
    <div className="flex flex-col w-full flex-grow justify-center items-center text-gray-800 dark:text-gray-200">
      <div>This is a 404</div>
      <div>
        Take me <Link route="home" label="home" />?
      </div>
    </div>
  );
};
