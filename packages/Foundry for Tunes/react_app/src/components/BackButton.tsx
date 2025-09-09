import { HiChevronLeft } from "react-icons/hi";

export const BackButton = ({ className }: { className?: string }) => {
  return (
    <button className={className} onClick={() => window.history.back()}>
      <HiChevronLeft className="w-6 h-6" />
    </button>
  );
};
