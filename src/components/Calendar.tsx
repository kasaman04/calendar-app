import React from 'react';
import { CalendarDay, WEEKDAYS_SHORT, generateCalendarDays } from '../utils/dateUtils';

interface CalendarProps {
  year: number;
  month: number;
  monthName: string;
}

const getMonthImage = (month: number): string => {
  const images = [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', // January - Winter flowers
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', // February - Pink flowers
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop', // March - Spring blooms
    'https://images.unsplash.com/photo-1563789031959-4c53abc684c3?w=400&h=300&fit=crop', // April - Cherry blossoms
    'https://images.unsplash.com/photo-1592062644994-6fc4faf8e8c2?w=400&h=300&fit=crop', // May - Roses
    'https://images.unsplash.com/photo-1597848212624-e6421bb98fb6?w=400&h=300&fit=crop', // June - Summer flowers
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=300&fit=crop', // July - Sunflowers
    'https://images.unsplash.com/photo-1566146991569-696da38bb775?w=400&h=300&fit=crop', // August - Lavender
    'https://images.unsplash.com/photo-1601985705806-5b2e9b3b71b4?w=400&h=300&fit=crop', // September - Autumn flowers
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', // October - Fall blooms
    'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=300&fit=crop', // November - Dried flowers
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop'  // December - Winter arrangements
  ];
  return images[month] || images[0];
};

const Calendar: React.FC<CalendarProps> = ({ year, month, monthName }) => {
  const days = generateCalendarDays(year, month);

  return (
    <div className="w-full h-screen bg-blue-700 flex flex-col text-white font-poppins overflow-hidden">
      {/* Top arch photo area */}
      <div className="relative w-full h-80 mb-6">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${getMonthImage(month)})`,
            clipPath: 'ellipse(100% 100% at 50% 0%)'
          }}
        />
      </div>

      {/* Month title */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-4xl font-light tracking-wide">
          {monthName}
        </h1>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 px-8 pb-8">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {WEEKDAYS_SHORT.map((day) => (
            <div key={day} className="text-center text-sm font-light text-white/90 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.slice(0, 35).map((day, index) => (
            <div
              key={index}
              className={`
                text-center py-3 text-base font-light
                ${day.isCurrentMonth 
                  ? 'text-white' 
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
  );
};

export default Calendar;