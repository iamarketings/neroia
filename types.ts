export interface Avatar {
  id: string;
  dataUrl: string; // The full data URL for display (data:image/png;base64,...)
  base64Data: string; // The raw base64 string for the API
  mimeType: string;
  source: 'upload' | 'generated';
}

export interface GeneratedVideo {
  id: string;
  videoUrl: string;
  prompt: string;
  timestamp: number;
}

export enum AppState {
  SELECT_KEY = 'SELECT_KEY',
  AVATAR_SELECTION = 'AVATAR_SELECTION',
  VIDEO_GENERATION = 'VIDEO_GENERATION',
}

// Augment global types
declare global {
  // We augment the AIStudio interface which is used by the global window declaration.
  // The environment provides window.aistudio of type AIStudio.
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }
}