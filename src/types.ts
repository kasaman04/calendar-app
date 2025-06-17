export type Activity = "work" | "rest" | "outing" | "study";

export type TimeBarMode = "ざっくり" | "きっちり";

export interface DaySlot {
  startHour: 0 | 4 | 8 | 12 | 16 | 20;
  activity: Activity | null;
}

export interface HourlySlot {
  startHour: number; // 0-23
  activity: Activity | null;
}

export interface DayRecord {
  date: string;      // ISO: "2025-01-07"
  slots: DaySlot[];  // length = 6
}

export interface DayRecordHourly {
  date: string;      // ISO: "2025-01-07"
  slots: HourlySlot[]; // length = 24
}

export interface AppSettings {
  timeBarMode: TimeBarMode;
}

export interface MonthImage {
  id: string;
  fileName: string;
  dataUrl: string;
  uploadDate: string; // ISO date
}

export interface MonthImages {
  year: number;
  month: number; // 1-12
  images: MonthImage[];
}