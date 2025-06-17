import { useState } from 'react';
import CalendarGrid from './components/CalendarGrid';
import DayBarModal from './components/DayBarModal';
import SettingsModal from './components/SettingsModal';
import RecordTimeline from './components/RecordTimeline';
import ArchPhotoSection from './components/ArchPhotoSection';
import dayjs from 'dayjs';
import './index.css';

function App() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDate(null);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => prev.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => prev.add(1, 'month'));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            カレンダー＆予定管理
          </h1>
          <p className="text-gray-600">
            日付をクリックして時間別の予定を管理しましょう
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg bg-white shadow hover:shadow-md transition-shadow"
          >
            ← 前月
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 px-4 rounded-lg bg-white shadow hover:shadow-md transition-shadow text-sm"
          >
            ⚙️ 設定
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg bg-white shadow hover:shadow-md transition-shadow"
          >
            次月 →
          </button>
        </div>

        <ArchPhotoSection
          year={currentDate.year()}
          month={currentDate.month() + 1}
        />

        <CalendarGrid
          year={currentDate.year()}
          month={currentDate.month() + 1}
          onSelect={handleDateSelect}
        />

        <RecordTimeline />

        {selectedDate && (
          <DayBarModal
            date={selectedDate}
            open={modalOpen}
            onClose={handleModalClose}
          />
        )}

        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;