import { Suspense } from 'react';
import { apps } from '../registry';
import AppIcon from './AppIcon';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-white">Jyntry - My apps entry</h1>
        <p className="text-sm text-white/40 mt-1">{apps.length} apps</p>
      </div>

      {/* App grid */}
      <Suspense fallback={null}>
        <div className="px-6 grid grid-cols-4 gap-6">
          {apps.map((app) => (
            <AppIcon key={app.id} app={app} />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
