import React from 'react';

export interface ManagementTabItem {
  id: string;
  label: string;
  count?: number;
  icon: React.ReactNode;
}

interface ManagementTabsBarProps {
  tabs: ManagementTabItem[];
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  accentColor?: 'purple' | 'emerald';
}

export const ManagementTabsBar: React.FC<ManagementTabsBarProps> = ({
  tabs,
  activeTab,
  onSelectTab,
  accentColor = 'emerald'
}) => {
  const isPurple = accentColor === 'purple';

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xs p-1.5 select-none transition-all">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? isPurple
                    ? 'bg-purple-100/90 text-purple-900 border border-purple-300/80 shadow-2xs scale-[1.01]'
                    : 'bg-emerald-100/90 text-emerald-950 border border-emerald-300/80 shadow-2xs scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
              }`}
            >
              <span className={`w-4 h-4 shrink-0 ${isActive ? (isPurple ? 'text-purple-700' : 'text-emerald-700') : 'text-slate-400'}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                    isActive
                      ? isPurple
                        ? 'bg-purple-200 text-purple-900'
                        : 'bg-emerald-200 text-emerald-900'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
