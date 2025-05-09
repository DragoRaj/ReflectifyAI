
import React from 'react';

export type MeditationTheme = "calm" | "focus" | "sleep" | "gratitude" | "custom";

export interface MeditationPreset {
  id: MeditationTheme;
  name: string;
  icon: React.ReactNode;
  duration: number;
  description: string;
  color: string;
  audioSrc: string;
}

export interface MeditationPrompts {
  [key: string]: string[];
}
