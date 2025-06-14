import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

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
    <div className="w-full h-screen overflow-hidden bg-blue-700">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet bg-white/50',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-white'
        }}
        initialSlide={initialSlideIndex}
        onSlideChange={handleSlideChange}
        className="w-full h-full mobile-swiper"
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
        
        {/* Custom navigation buttons - hidden for mobile */}
        <div className="swiper-button-prev !hidden md:!flex !text-white/70 !text-2xl"></div>
        <div className="swiper-button-next !hidden md:!flex !text-white/70 !text-2xl"></div>
      </Swiper>
      
      <style jsx>{`
        .mobile-swiper .swiper-pagination {
          bottom: 20px !important;
        }
        .mobile-swiper .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          margin: 0 4px !important;
        }
      `}</style>
    </div>
  );
};

export default MonthSlider;