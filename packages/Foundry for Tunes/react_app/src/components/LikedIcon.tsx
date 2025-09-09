import { FaHeart, FaRegHeart } from "react-icons/fa";
import classNames from "classnames";

export interface FavoriteIconProps {
  className?: string;
  iconClassName?: string;
  liked: boolean | undefined;
  setLiked: (value: boolean) => void;
}

export const LikedIcon = ({
  iconClassName,
  className,
  liked,
  setLiked,
}: FavoriteIconProps) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setLiked(!liked);
        // likedOrUnlikeSong(!liked);
      }}
      title="Save to Likes"
      className={classNames(
        className,
        "text-purple-500 focus:outline-none focus:bg-purple-400 focus:bg-opacity-25 p-1 rounded-full"
      )}
    >
      {liked ? (
        <FaHeart className={iconClassName} />
      ) : (
        <FaRegHeart className={iconClassName} />
      )}
    </button>
  );
};
