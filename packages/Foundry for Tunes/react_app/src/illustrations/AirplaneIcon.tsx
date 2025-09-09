export interface AirplaneIconProps {
  className?: string;
  wingsClassName?: string;
  spineClassName?: string;
  trailClassName?: string;
}

export const AirplaneIcon = ({ className }: AirplaneIconProps) => {
  return (
    <svg
      width={200}
      height={150}
      viewBox="0 0 800 600"
      fill="none"
      className={className}
    >
      <path
        d="M415.737 228.626L322.395 116l467.604 64.194-458.698 256.098 84.436-207.666z"
        fill="#C4B6FF"
      />
      <path
        d="M350.371 283.684l70.451-55.717 358.983-46.455-429.434 102.172z"
        fill="#7D55FF"
      />
      <path
        d="M10 484.556c0-182.86 287.145-204.803 312.388-208.41"
        stroke="#78D2EE"
        strokeWidth={17}
        strokeDasharray="20.9 20.9"
      />
    </svg>
  );
};
