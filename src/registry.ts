import { lazy, type ComponentType } from 'react';

export interface AppMeta {
  id: string; // route path
  name: string; // display name
  icon: string; // emoji icon
  color: string; // gradient start color
  colorTo: string; // gradient end color
  component: ComponentType;
}

export const apps: AppMeta[] = [
  {
    id: 'calculator',
    name: 'Calculator',
    icon: '🧮',
    color: '#3B82F6',
    colorTo: '#1D4ED8',
    component: lazy(() => import('./apps/calculator')),
  },
];
