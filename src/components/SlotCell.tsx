import React, { useState } from 'react';
import { DaySlot, Activity } from '../types';
import ActivityMenu from './ActivityMenu';

interface SlotCellProps {
  slot: DaySlot;
  onPick: (activity: Activity) => void;
}

const colorMap = {
  work: "bg-blue-500",
  rest: "bg-gray-300", 
  outing: "bg-emerald-400",
  study: "bg-purple-400",
  null: "bg-neutral-200"
};

const SlotCell: React.FC<SlotCellProps> = ({ slot, onPick }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleSlotClick = () => {
    setShowMenu(true);
  };

  const handleActivitySelect = (activity: Activity) => {
    onPick(activity);
    setShowMenu(false);
  };

  const getTimeLabel = (hour: number) => {
    return `${hour}:00-${hour + 4}:00`;
  };

  return (
    <div className="relative">
      <div
        onClick={handleSlotClick}
        className={`
          h-16 rounded-lg cursor-pointer border-2 border-gray-200 
          flex items-center justify-center text-xs font-medium text-gray-700
          hover:border-gray-300 transition-colors
          ${colorMap[slot.activity || 'null']}
        `}
      >
        <div className="text-center">
          <div className="text-xs opacity-75">
            {getTimeLabel(slot.startHour)}
          </div>
          {slot.activity && (
            <div className="text-xs mt-1 font-semibold">
              {slot.activity === 'work' && '仕事'}
              {slot.activity === 'rest' && '休み'}
              {slot.activity === 'outing' && '外出'}
              {slot.activity === 'study' && '勉強'}
            </div>
          )}
        </div>
      </div>
      
      {showMenu && (
        <ActivityMenu
          onPick={handleActivitySelect}
          onClose={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default SlotCell;