import React, { useState, useEffect } from 'react';
import { DayRecord, DayRecordHourly, DaySlot, HourlySlot, Activity } from '../types';
import { useRecords } from '../store/useRecords';
import { useSettings } from '../store/useSettings';
import SlotCell from './SlotCell';
import HourlySlotCell from './HourlySlotCell';

interface DayBarModalProps {
  date: string;
  open: boolean;
  onClose: () => void;
}

const createEmptyRecord = (date: string): DayRecord => ({
  date,
  slots: [
    { startHour: 0, activity: null },
    { startHour: 4, activity: null },
    { startHour: 8, activity: null },
    { startHour: 12, activity: null },
    { startHour: 16, activity: null },
    { startHour: 20, activity: null },
  ] as DaySlot[]
});

const createEmptyHourlyRecord = (date: string): DayRecordHourly => ({
  date,
  slots: Array.from({ length: 24 }, (_, hour) => ({
    startHour: hour,
    activity: null
  })) as HourlySlot[]
});

const DayBarModal: React.FC<DayBarModalProps> = ({ date, open, onClose }) => {
  const { records, hourlyRecords, setRecord, setHourlyRecord } = useRecords();
  const { timeBarMode } = useSettings();
  
  const [record, setLocalRecord] = useState<DayRecord>(() => 
    records[date] || createEmptyRecord(date)
  );
  
  const [hourlyRecord, setLocalHourlyRecord] = useState<DayRecordHourly>(() => 
    hourlyRecords[date] || createEmptyHourlyRecord(date)
  );

  useEffect(() => {
    setLocalRecord(records[date] || createEmptyRecord(date));
    setLocalHourlyRecord(hourlyRecords[date] || createEmptyHourlyRecord(date));
  }, [date, records, hourlyRecords]);

  const updateSlot = (slotIndex: number, activity: Activity) => {
    const newRecord = {
      ...record,
      slots: record.slots.map((slot, index) =>
        index === slotIndex ? { ...slot, activity } : slot
      )
    };
    setLocalRecord(newRecord);
  };

  const updateHourlySlot = (slotIndex: number, activity: Activity) => {
    const newRecord = {
      ...hourlyRecord,
      slots: hourlyRecord.slots.map((slot, index) =>
        index === slotIndex ? { ...slot, activity } : slot
      )
    };
    setLocalHourlyRecord(newRecord);
  };

  const handleSave = () => {
    if (timeBarMode === "ざっくり") {
      setRecord(record);
    } else {
      setHourlyRecord(hourlyRecord);
    }
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {formatDate(date)}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              時間帯を選択してください ({timeBarMode}モード)
            </p>
          </div>

          {timeBarMode === "ざっくり" ? (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {record.slots.map((slot, index) => (
                <SlotCell
                  key={index}
                  slot={slot}
                  onPick={(activity) => updateSlot(index, activity)}
                />
              ))}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto mb-6">
              <div className="space-y-1">
                {hourlyRecord.slots.map((slot, index) => (
                  <HourlySlotCell
                    key={index}
                    slot={slot}
                    onPick={(activity) => updateHourlySlot(index, activity)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DayBarModal;