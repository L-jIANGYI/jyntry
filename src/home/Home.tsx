import { Suspense } from 'react';
import { apps } from '../registry';
import AppIcon from './AppIcon';

export default function Home() {
  return (
    <div className="min-h-screen min-h-dvh flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white">My Apps</h1>
        <p className="text-sm text-white/40 mt-1">{apps.length} apps</p>
      </div>

      {/* App grid */}
      <Suspense fallback={null}>
        <div className="px-5 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-x-2 gap-y-6">
          {apps.map((app) => (
            <AppIcon key={app.id} app={app} />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
