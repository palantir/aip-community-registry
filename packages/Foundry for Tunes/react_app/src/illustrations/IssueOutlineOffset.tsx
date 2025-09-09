export interface IssueOutlineOffsetProps {
  backgroundClassName?: string;
  className?: string;
}

export const IssueOutlineOffset = ({
  backgroundClassName,
  className,
}: IssueOutlineOffsetProps) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-reactroot=""
    >
      <path
        className={backgroundClassName}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="0"
        stroke="#594785"
        fill="#C4B6FF"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        transform="translate(2,2)"
      ></path>
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="1"
        stroke="#594785"
        fill="none"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      ></path>
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="1"
        stroke="#594785"
        d="M12 6V14"
      ></path>
      <path
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="1"
        stroke="#594785"
        d="M11.99 18H12.01"
      ></path>
    </svg>
  );
};
