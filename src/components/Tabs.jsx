export default function Tabs({ tabs, activeKey, onChange }) {
  return (
    <div className="bg-slate-50 rounded-full shadow p-1 flex items-center justify-between gap-1">
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`
                flex-1 flex items-center justify-center gap-2 rounded-full p-2 transition-all duration-200 md:px-6 md:py-3 
                ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-300/50"
                    : "text-slate-500 hover:bg-slate-100"
                }
            `}
          >
            <span className="text-[24px] flex items-center justify-center">
              {tab.icon}
            </span>
            <span className="hidden font-medium lg:inline">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
