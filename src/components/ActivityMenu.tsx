import React from 'react';
import { Activity } from '../types';

interface ActivityMenuProps {
  onPick: (activity: Activity) => void;
  onClose: () => void;
}

const activities: { key: Activity; label: string; color: string }[] = [
  { key: 'work', label: '仕事', color: 'bg-blue-500' },
  { key: 'rest', label: '休み', color: 'bg-gray-300' },
  { key: 'outing', label: '外出', color: 'bg-emerald-400' },
  { key: 'study', label: '勉強', color: 'bg-purple-400' },
];

const ActivityMenu: React.FC<ActivityMenuProps> = ({ onPick, onClose }) => {
  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border z-50 p-2 min-w-[120px]">
        {activities.map((activity) => (
          <button
            key={activity.key}
            onClick={() => onPick(activity.key)}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-md 
              hover:bg-gray-100 transition-colors text-left
            `}
          >
            <div className={`w-4 h-4 rounded ${activity.color}`} />
            <span className="text-sm font-medium text-gray-700">
              {activity.label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};

export default ActivityMenu;