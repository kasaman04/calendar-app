import React, { useState } from 'react';
import Calendar from './Calendar';
import { MONTHS } from '../utils/dateUtils';

const MonthSlider: React.FC = () => {
  const currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(currentDate.getMonth());

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <Calendar
        year={currentYear}
        month={currentMonthIndex}
        monthName={MONTHS[currentMonthIndex]}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
    </div>
  );
};

export default MonthSlider;