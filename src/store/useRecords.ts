import { DayRecord, DayRecordHourly, MonthImages, MonthImage } from "../types";

interface RecordsState {
  records: Record<string, DayRecord>;
  hourlyRecords: Record<string, DayRecordHourly>;
  monthImages: Record<string, MonthImages>; // key: "YYYY-MM"
  setRecord: (record: DayRecord) => void;
  setHourlyRecord: (record: DayRecordHourly) => void;
  deleteRecord: (date: string) => void;
  deleteHourlyRecord: (date: string) => void;
  addImageToMonth: (year: number, month: number, image: MonthImage) => void;
  removeImageFromMonth: (year: number, month: number, imageId: string) => void;
  getMonthImages: (year: number, month: number) => MonthImage[];
}

// Simple state management without zustand for now
let state: RecordsState = {
  records: JSON.parse(localStorage.getItem("records") || "{}"),
  hourlyRecords: JSON.parse(localStorage.getItem("hourlyRecords") || "{}"),
  monthImages: JSON.parse(localStorage.getItem("monthImages") || "{}"),
  setRecord: (record: DayRecord) => {
    state.records = { ...state.records, [record.date]: record };
    localStorage.setItem("records", JSON.stringify(state.records));
    // Trigger re-render for components that use this
    window.dispatchEvent(new CustomEvent('recordsChanged'));
  },
  setHourlyRecord: (record: DayRecordHourly) => {
    state.hourlyRecords = { ...state.hourlyRecords, [record.date]: record };
    localStorage.setItem("hourlyRecords", JSON.stringify(state.hourlyRecords));
    // Trigger re-render for components that use this
    window.dispatchEvent(new CustomEvent('recordsChanged'));
  },
  deleteRecord: (date: string) => {
    const { [date]: _, ...rest } = state.records;
    state.records = rest;
    localStorage.setItem("records", JSON.stringify(state.records));
    // Trigger re-render for components that use this
    window.dispatchEvent(new CustomEvent('recordsChanged'));
  },
  deleteHourlyRecord: (date: string) => {
    const { [date]: _, ...rest } = state.hourlyRecords;
    state.hourlyRecords = rest;
    localStorage.setItem("hourlyRecords", JSON.stringify(state.hourlyRecords));
    // Trigger re-render for components that use this
    window.dispatchEvent(new CustomEvent('recordsChanged'));
  },
  addImageToMonth: (year: number, month: number, image: MonthImage) => {
    const key = `${year}-${month.toString().padStart(2, '0')}`;
    const existing = state.monthImages[key] || { year, month, images: [] };
    existing.images.push(image);
    state.monthImages = { ...state.monthImages, [key]: existing };
    localStorage.setItem("monthImages", JSON.stringify(state.monthImages));
    window.dispatchEvent(new CustomEvent('imagesChanged'));
  },
  removeImageFromMonth: (year: number, month: number, imageId: string) => {
    const key = `${year}-${month.toString().padStart(2, '0')}`;
    const existing = state.monthImages[key];
    if (existing) {
      existing.images = existing.images.filter(img => img.id !== imageId);
      state.monthImages = { ...state.monthImages, [key]: existing };
      localStorage.setItem("monthImages", JSON.stringify(state.monthImages));
      window.dispatchEvent(new CustomEvent('imagesChanged'));
    }
  },
  getMonthImages: (year: number, month: number) => {
    const key = `${year}-${month.toString().padStart(2, '0')}`;
    return state.monthImages[key]?.images || [];
  }
};

export const useRecords = () => state;

// Auto-cleanup past records
const startAutoCleanup = () => {
  const cleanup = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString().split('T')[0];
    
    const kept = Object.fromEntries(
      Object.entries(state.records).filter(([date]) => date >= todayISO)
    );
    
    const hourlyKept = Object.fromEntries(
      Object.entries(state.hourlyRecords).filter(([date]) => date >= todayISO)
    );
    
    if (Object.keys(kept).length !== Object.keys(state.records).length) {
      state.records = kept;
      localStorage.setItem("records", JSON.stringify(state.records));
      window.dispatchEvent(new CustomEvent('recordsChanged'));
    }
    
    if (Object.keys(hourlyKept).length !== Object.keys(state.hourlyRecords).length) {
      state.hourlyRecords = hourlyKept;
      localStorage.setItem("hourlyRecords", JSON.stringify(state.hourlyRecords));
      window.dispatchEvent(new CustomEvent('recordsChanged'));
    }
  };

  // Run cleanup every hour
  setInterval(cleanup, 60 * 60 * 1000);
  // Run cleanup on startup
  cleanup();
};

// Start auto-cleanup when module loads
startAutoCleanup();