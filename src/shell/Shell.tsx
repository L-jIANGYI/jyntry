import { useNavigate } from 'react-router';

interface Props {
  name: string;
  children: React.ReactNode;
}

export default function Shell({ name, children }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-white/10">
        <button
          onClick={() => navigate('/')}
          className="text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none text-sm flex items-center gap-1"
        >
          ← Back
        </button>
        <span className="text-white font-semibold">{name}</span>
      </div>

      {/* App content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
