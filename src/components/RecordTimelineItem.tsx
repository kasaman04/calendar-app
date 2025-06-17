import React, { useRef, useState, useEffect } from 'react';
import { DayRecord } from '../types';

interface RecordTimelineItemProps {
  record: DayRecord;
  onDelete: (date: string) => void;
}

const colorMap = {
  work: "bg-blue-500",
  rest: "bg-gray-300", 
  outing: "bg-emerald-400",
  study: "bg-purple-400",
  null: "bg-neutral-200"
};

const SWIPE_THRESHOLD = 80;

const RecordTimelineItem: React.FC<RecordTimelineItemProps> = ({ record, onDelete }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = Math.max(0, e.clientX - startX);
      setCurrentX(deltaX);
      
      if (elementRef.current) {
        elementRef.current.style.transform = `translateX(${deltaX}px)`;
        elementRef.current.style.transition = 'none';
      }
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      
      setIsDragging(false);
      const deltaX = currentX;
      
      if (deltaX > SWIPE_THRESHOLD) {
        onDelete(record.date);
      } else {
        if (elementRef.current) {
          elementRef.current.style.transition = 'transform 0.3s ease-out';
          elementRef.current.style.transform = 'translateX(0)';
        }
      }
      
      setCurrentX(0);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, currentX, onDelete, record.date]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const deltaX = Math.max(0, e.touches[0].clientX - startX);
    setCurrentX(deltaX);
    
    if (elementRef.current) {
      elementRef.current.style.transform = `translateX(${deltaX}px)`;
      elementRef.current.style.transition = 'none';
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    setIsDragging(false);
    const deltaX = currentX;
    
    if (deltaX > SWIPE_THRESHOLD) {
      onDelete(record.date);
    } else {
      if (elementRef.current) {
        elementRef.current.style.transition = 'transform 0.3s ease-out';
        elementRef.current.style.transform = 'translateX(0)';
      }
    }
    
    setCurrentX(0);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div 
      ref={elementRef}
      className="select-none"
      style={{ 
        marginBottom: '12px',
        padding: '10px',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        touchAction: 'pan-y',
        cursor: isDragging ? 'grabbing' : 'pointer'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="text-xs text-gray-600 mb-1">
        {formatDate(record.date)}
      </div>
      <div className="flex h-4 rounded overflow-hidden shadow">
        {record.slots.map((slot, index) => (
          <div
            key={index}
            className={`flex-1 ${colorMap[slot.activity || 'null']}`}
            title={`${slot.startHour}:00-${slot.startHour + 4}:00 ${
              slot.activity 
                ? slot.activity === 'work' ? '仕事' 
                  : slot.activity === 'rest' ? '休み'
                  : slot.activity === 'outing' ? '外出'
                  : '勉強'
                : '未設定'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default RecordTimelineItem;