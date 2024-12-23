import React from "react";
import { IconType } from "react-icons/lib";

export const EmptyState = ({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: IconType;
}) => {
  return (
    <div className="text-gray-700 dark:text-gray-300 flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center h-full px-4 space-y-2">
      <Icon className="w-16 h-16" />
      <div>{children}</div>
    </div>
  );
};
