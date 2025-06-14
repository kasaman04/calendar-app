import React from 'react';
import { CalendarDay, WEEKDAYS, generateCalendarDays } from '../utils/dateUtils';

interface CalendarProps {
  year: number;
  month: number;
  monthName: string;
}

const Calendar: React.FC<CalendarProps> = ({ year, month, monthName }) => {
  const days = generateCalendarDays(year, month);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex flex-col items-center justify-center text-white font-poppins">
      <div className="w-96 max-w-sm mx-auto">
        <div className="mb-8 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌸</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-semibold text-center mb-8">
            {monthName}
          </h1>
        </div>

        <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-sm">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {WEEKDAYS.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-white/80 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div
                key={index}
                className={`
                  text-center py-3 text-sm font-medium rounded-lg
                  ${day.isCurrentMonth 
                    ? 'text-white hover:bg-white/20 cursor-pointer transition-colors' 
                    : 'text-white/40'
                  }
                `}
              >
                {day.date}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;