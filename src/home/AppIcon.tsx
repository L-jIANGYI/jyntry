import { useNavigate } from 'react-router';
import type { AppMeta } from '../registry';

interface Props {
  app: AppMeta;
}

export default function AppIcon({ app }: Props) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(`/${app.id}`)} className="flex flex-col items-center gap-2 group cursor-pointer bg-transparent border-none p-2">
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg
                   transition-all duration-150 ease-out
                   group-hover:scale-110
                   group-active:scale-95"
        style={{
          background: `linear-gradient(135deg, ${app.color}, ${app.colorTo})`,
          boxShadow: `0 4px 20px ${app.color}55`,
        }}
      >
        {app.icon}
      </div>

      {/* Label */}
      <span className="text-xs text-white/80 font-medium">{app.name}</span>
    </button>
  );
}
