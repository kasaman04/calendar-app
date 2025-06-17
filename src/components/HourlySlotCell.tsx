import React, { useState } from 'react';
import { HourlySlot, Activity } from '../types';
import ActivityMenu from './ActivityMenu';

interface HourlySlotCellProps {
  slot: HourlySlot;
  onPick: (activity: Activity) => void;
}

const colorMap = {
  work: "bg-blue-500",
  rest: "bg-gray-300", 
  outing: "bg-emerald-400",
  study: "bg-purple-400",
  null: "bg-neutral-200"
};

const HourlySlotCell: React.FC<HourlySlotCellProps> = ({ slot, onPick }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleSlotClick = () => {
    setShowMenu(true);
  };

  const handleActivitySelect = (activity: Activity) => {
    onPick(activity);
    setShowMenu(false);
  };

  const getTimeLabel = (hour: number) => {
    const nextHour = hour === 23 ? '23:59' : `${(hour + 1).toString().padStart(2, '0')}:00`;
    return `${hour.toString().padStart(2, '0')}:00-${nextHour}`;
  };

  return (
    <div className="relative">
      <div
        onClick={handleSlotClick}
        className={`
          h-12 rounded cursor-pointer border border-gray-200 
          flex items-center justify-between px-3 text-xs
          hover:border-gray-300 transition-colors
          ${colorMap[slot.activity || 'null']}
        `}
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-700 w-8">
            {slot.startHour.toString().padStart(2, '0')}
          </span>
          <div className="text-xs opacity-75">
            {getTimeLabel(slot.startHour)}
          </div>
        </div>
        
        {slot.activity && (
          <div className="text-xs font-semibold text-gray-700">
            {slot.activity === 'work' && '仕事'}
            {slot.activity === 'rest' && '休み'}
            {slot.activity === 'outing' && '外出'}
            {slot.activity === 'study' && '勉強'}
          </div>
        )}
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

export default HourlySlotCell;