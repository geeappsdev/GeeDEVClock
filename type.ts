export interface Settings {
  theme: string;
  darkMode: boolean;
  useSearch: boolean;
  aiUnlocked: boolean;
  alarmSound: string;
  customAlarmSoundUrl: string;
  showDateTimeInHeader: boolean;
}

export interface Timer {
  id: number;
  label: string;
  duration: number;
  remaining: number;
  isRunning: boolean;
  startTime: number | null;
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: GroundingSource[];
  rating?: 'good' | 'bad';
}

export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  'text-primary': string;
  'text-secondary': string;
};

export type Theme = {
  dark: ThemeColors;
  light: ThemeColors;
};

export type Themes = {
  [key: string]: Theme;
};

export type AlarmSound = {
    name: string;
    url: string;
};

export type AlarmSounds = {
    [key: string]: AlarmSound;
};
