export interface MoreVerticalIconProps {
  className?: string;
}

export function MoreVerticalIcon(props: MoreVerticalIconProps) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fill="#C4B6FF"
        d="M14 24c5.523 0 10-4.477 10-10S19.523 4 14 4 4 8.477 4 14s4.477 10 10 10z"
      />
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeMiterlimit={10}
        stroke="#594785"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
      />
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeMiterlimit={10}
        stroke="#594785"
        d="M12 7.5a1 1 0 100-2 1 1 0 000 2zM12 13a1 1 0 100-2 1 1 0 000 2zM12 18.5a1 1 0 100-2 1 1 0 000 2z"
      />
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeMiterlimit={10}
        stroke="#594785"
        d="M12 12.5a.5.5 0 100-1 .5.5 0 000 1zM12 7a.5.5 0 100-1 .5.5 0 000 1zM12 18a.5.5 0 100-1 .5.5 0 000 1z"
      />
    </svg>
  );
}
