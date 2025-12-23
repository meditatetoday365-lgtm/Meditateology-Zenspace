
export interface MeditationSession {
  id: string;
  title: string;
  duration: string;
  category: 'Focus' | 'Calm' | 'Sleep' | 'Stress';
  image: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type BreathingState = 'Inhale' | 'Hold' | 'Exhale' | 'Pause' | 'Idle';
