import { AppSettings, TimeBarMode } from "../types";

interface SettingsState extends AppSettings {
  setTimeBarMode: (mode: TimeBarMode) => void;
}

const defaultSettings: AppSettings = {
  timeBarMode: "ざっくり"
};

let state: SettingsState = {
  ...defaultSettings,
  ...JSON.parse(localStorage.getItem("appSettings") || "{}"),
  setTimeBarMode: (mode: TimeBarMode) => {
    state.timeBarMode = mode;
    const settings: AppSettings = { timeBarMode: state.timeBarMode };
    localStorage.setItem("appSettings", JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('settingsChanged'));
  }
};

export const useSettings = () => state;