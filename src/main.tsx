import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { apps } from './registry';
import Home from './home/Home';
import Shell from './shell/Shell';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Home screen */}
        <Route path="/" element={<Home />} />

        {/* Each app gets its own route, wrapped in Shell */}
        {apps.map((app) => (
          <Route
            key={app.id}
            path={`/${app.id}`}
            element={
              <Shell name={app.name}>
                <Suspense fallback={<div className="flex items-center justify-center h-full text-white/40 pt-20">Loading...</div>}>
                  <app.component />
                </Suspense>
              </Shell>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
