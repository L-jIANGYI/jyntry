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
  {
    id: 'relationship',
    name: 'Relationship',
    icon: '👨‍👩‍👧‍👦',
    color: '#F59E0B',
    colorTo: '#B45309',
    component: lazy(() => import('./apps/relationship')),
  },
  {
    id: 'orbito',
    name: 'Orbito',
    icon: '⭕',
    color: '#EC4899',
    colorTo: '#9D174D',
    component: lazy(() => import('./apps/orbito')),
  },
  {
    id: 'currency',
    name: 'Currency',
    icon: '💱',
    color: '#10B981',
    colorTo: '#065F46',
    component: lazy(() => import('./apps/currency')),
  },
];
