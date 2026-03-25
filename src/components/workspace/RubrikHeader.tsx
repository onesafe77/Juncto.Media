import React from 'react';

interface RubrikHeaderProps {
  title: string;
  description: string;
  accentColor: string;
  icon: React.ReactNode;
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function RubrikHeader({
  title,
  description,
  accentColor,
  icon,
  tabs,
  activeTab,
  onTabChange
}: RubrikHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div style={{ color: accentColor }}>
          {icon}
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-dark relative inline-block">
          {title}
          <div 
            className="absolute -bottom-2 left-0 w-full h-1.5 rounded-full" 
            style={{ backgroundColor: accentColor }}
          ></div>
        </h1>
      </div>
      <p className="text-text-medium text-lg mt-6">{description}</p>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 sm:pb-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border"
              style={
                activeTab === tab 
                  ? { backgroundColor: accentColor, color: 'white', borderColor: accentColor }
                  : { backgroundColor: 'white', color: '#64748b', borderColor: '#cbd5e1' }
              }
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-sm font-medium text-text-medium shrink-0">
          <span>Urutkan:</span>
          <select className="bg-white border border-blue-gray/30 rounded-lg px-3 py-2 outline-none focus:border-primary">
            <option>Terbaru</option>
            <option>Terpopuler</option>
            <option>Terlama</option>
          </select>
        </div>
      </div>
    </div>
  );
}
