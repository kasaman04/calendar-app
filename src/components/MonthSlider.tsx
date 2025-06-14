import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Calendar from './Calendar';
import { MONTHS } from '../utils/dateUtils';

const MonthSlider: React.FC = () => {
  const currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(currentDate.getMonth());

  const generateMonths = () => {
    const months = [];
    const startYear = currentYear - 1;
    const endYear = currentYear + 1;
    
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month < 12; month++) {
        months.push({
          year,
          month,
          monthName: MONTHS[month],
          key: `${year}-${month}`
        });
      }
    }
    return months;
  };

  const months = generateMonths();
  const initialSlideIndex = months.findIndex(
    m => m.year === currentYear && m.month === currentMonthIndex
  );

  const handleSlideChange = (swiper: any) => {
    const activeIndex = swiper.activeIndex;
    const activeMonth = months[activeIndex];
    setCurrentYear(activeMonth.year);
    setCurrentMonthIndex(activeMonth.month);
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        initialSlide={initialSlideIndex}
        onSlideChange={handleSlideChange}
        className="w-full h-full"
      >
        {months.map((monthData) => (
          <SwiperSlide key={monthData.key}>
            <Calendar
              year={monthData.year}
              month={monthData.month}
              monthName={monthData.monthName}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MonthSlider;