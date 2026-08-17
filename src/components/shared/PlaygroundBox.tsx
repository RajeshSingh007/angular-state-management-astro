const BTN_COLOR = 'rgb(10, 102, 194)';

interface PlaygroundBoxProps {
  title: string;
  subtitle: string;
  body: string;
  flash: boolean;
  noSelector?: boolean;
  accentColor?: 'orange' | 'blue';
  children?: React.ReactNode;
}

export function PlaygroundBox({
  title, subtitle, body, flash, noSelector, accentColor = 'orange', children
}: PlaygroundBoxProps) {
  return (
    <div className={`rounded-xl border-2 p-3 mb-3 transition-all duration-300 ${
      flash
        ? 'bg-green-100 border-green-500 shadow-md'
        : noSelector
          ? 'bg-gray-50 border-gray-300'
          : 'bg-gray-50 border-gray-200'
    }`}>
      <p className="font-bold text-sm text-[#1a1a2e] dark:text-white">{title}</p>
      <p className={`text-xs mb-2 font-semibold ${
        noSelector ? 'text-gray-400' : accentColor === 'blue' ? 'text-blue-500' : 'text-orange-500'
      }`}>{subtitle}</p>
      <div className="text-xs bg-white rounded px-2 py-1.5 min-h-[1.5rem] text-gray-700">{body}</div>
      {children && <div className="mt-2 flex gap-1.5 flex-wrap">{children}</div>}
    </div>
  );
}

interface ActionBtnProps {
  label: string;
  onClick: () => void;
}

export function ActionBtn({ label, onClick }: ActionBtnProps) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: BTN_COLOR }}
      className="px-3 py-1.5 text-white rounded-lg text-xs font-semibold transition-all hover:opacity-90 hover:scale-105 active:scale-95"
    >
      {label}
    </button>
  );
}
