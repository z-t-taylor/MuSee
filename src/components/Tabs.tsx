import React, { useState, ReactNode } from "react";

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex md:flex-col flex-row space-x-0.5 md:space-x-0 md:space-y-0.5 border-b md:border-b-0 md:border-r border-gray-300 pt-2">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`text-left font-medium p-2 pr-10 ${
              index === activeIndex
                ? "border-b-4 md:border-b-0 md:border-l-4 border-blue-500 bg-[#195183]/5"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 min-h-[300px] min-w-0 break-words">
        {tabs[activeIndex].content}
      </div>
    </div>
  );
};
