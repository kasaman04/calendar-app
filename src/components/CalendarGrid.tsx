import React from 'react';
import dayjs from 'dayjs';

interface CalendarGridProps {
  year: number;
  month: number;
  onSelect: (date: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ year, month, onSelect }) => {
  const today = dayjs();
  const currentMonth = dayjs().year(year).month(month - 1);
  const startOfMonth = currentMonth.startOf('month');
  const endOfMonth = currentMonth.endOf('month');
  const startOfCalendar = startOfMonth.startOf('week');
  const endOfCalendar = endOfMonth.endOf('week');

  const days = [];
  let current = startOfCalendar;

  while (current.isBefore(endOfCalendar) || current.isSame(endOfCalendar, 'day')) {
    days.push(current);
    current = current.add(1, 'day');
  }

  const handleDateClick = (date: dayjs.Dayjs) => {
    onSelect(date.format('YYYY-MM-DD'));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {currentMonth.format('YYYY年 MM月')}
        </h2>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} className="text-center py-2 text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = day.month() === month - 1;
          const isToday = day.isSame(today, 'day');
          const isPast = day.isBefore(today, 'day');

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                h-12 flex items-center justify-center text-sm rounded-lg transition-colors cursor-pointer
                ${isCurrentMonth 
                  ? 'text-gray-900 hover:bg-blue-50' 
                  : 'text-gray-400'
                }
                ${isToday 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : ''
                }
                ${isPast && isCurrentMonth 
                  ? 'opacity-50' 
                  : ''
                }
              `}
            >
              {day.date()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;