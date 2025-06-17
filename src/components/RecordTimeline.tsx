import React, { useState, useEffect } from 'react';
import { useRecords } from '../store/useRecords';
import RecordTimelineItem from './RecordTimelineItem';

const RecordTimeline: React.FC = () => {
  const { records, deleteRecord } = useRecords();
  const [, setUpdateCounter] = useState(0);

  useEffect(() => {
    const handleRecordsChange = () => {
      setUpdateCounter(prev => prev + 1);
    };

    window.addEventListener('recordsChanged', handleRecordsChange);
    return () => window.removeEventListener('recordsChanged', handleRecordsChange);
  }, []);

  const sortedRecords = Object.values(records).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedRecords.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">記録タイムライン</h3>
        <div className="text-center text-gray-500 py-8">
          まだ記録がありません
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">記録タイムライン</h3>
      <div className="text-xs text-gray-500 mb-4">
        → 右にスワイプで削除
      </div>
      <div className="space-y-2">
        {sortedRecords.map((record) => (
          <RecordTimelineItem
            key={record.date}
            record={record}
            onDelete={deleteRecord}
          />
        ))}
      </div>
    </div>
  );
};

export default RecordTimeline;