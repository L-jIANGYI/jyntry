import { type ComponentType } from 'react';

export interface AppMeta {
  id: string; // route path
  name: string; // display name
  icon: string; // emoji icon
  color: string; // gradient start color
  colorTo: string; // gradient end color
  description: string;
  component: ComponentType;
}

export const apps: AppMeta[] = [];
