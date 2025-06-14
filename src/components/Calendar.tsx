import React from 'react';
import { CalendarDay, WEEKDAYS_SHORT, generateCalendarDays } from '../utils/dateUtils';

interface CalendarProps {
  year: number;
  month: number;
  monthName: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const getMonthImage = (month: number): string => {
  const images = [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=180&fit=crop', // January - Winter flowers
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=180&fit=crop', // February - Pink flowers
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=180&fit=crop', // March - Spring blooms
    'https://images.unsplash.com/photo-1563789031959-4c53abc684c3?w=400&h=180&fit=crop', // April - Cherry blossoms
    'https://images.unsplash.com/photo-1592062644994-6fc4faf8e8c2?w=400&h=180&fit=crop', // May - Roses
    'https://images.unsplash.com/photo-1597848212624-e6421bb98fb6?w=400&h=180&fit=crop', // June - Summer flowers
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=180&fit=crop', // July - Sunflowers
    'https://images.unsplash.com/photo-1566146991569-696da38bb775?w=400&h=180&fit=crop', // August - Lavender
    'https://images.unsplash.com/photo-1601985705806-5b2e9b3b71b4?w=400&h=180&fit=crop', // September - Autumn flowers
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=180&fit=crop', // October - Fall blooms
    'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=180&fit=crop', // November - Dried flowers
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=180&fit=crop'  // December - Winter arrangements
  ];
  return images[month] || images[0];
};

const Calendar: React.FC<CalendarProps> = ({ year, month, monthName, onPrevMonth, onNextMonth }) => {
  const days = generateCalendarDays(year, month);

  return (
    <div className="w-full h-screen flex flex-col text-white font-poppins overflow-hidden" style={{ backgroundColor: '#3182CE' }}>
      {/* Top arch photo area - fixed size */}
      <div className="relative w-full flex items-end justify-center" style={{ height: '248px' }}>
        <div 
          className="bg-cover bg-center"
          style={{
            backgroundImage: `url(${getMonthImage(month)})`,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            width: '178px',
            height: '198px'
          }}
        />
      </div>

      {/* Month title with navigation - 10% of screen */}
      <div 
        className="relative text-center mb-8 px-4" 
        style={{ 
          height: '10vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <button 
          onClick={onPrevMonth}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
          style={{ fontSize: '16px' }}
        >
          ‹
        </button>
        
        <h1 className="text-2xl font-bold tracking-wide">
          {monthName}
        </h1>
        
        <button 
          onClick={onNextMonth}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
          style={{ fontSize: '16px' }}
        >
          ›
        </button>
      </div>

      {/* Calendar grid - remaining space */}
      <div className="flex-1 px-8 pb-6">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {WEEKDAYS_SHORT.map((day) => (
            <div key={day} className="text-center text-xs font-normal text-white/60 py-2">
              {day.toLowerCase()}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.slice(0, 35).map((day, index) => (
            <div
              key={index}
              className={`
                text-center py-3 text-sm font-normal flex items-center justify-center
                ${day.isCurrentMonth 
                  ? 'text-white' 
                  : 'text-white/40'
                }
              `}
              style={{ 
                width: '14%', 
                minHeight: '32px'
              }}
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