import dayjs from 'dayjs';

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  fullDate: string;
}

export const generateCalendarDays = (year: number, month: number): CalendarDay[] => {
  const firstDayOfMonth = dayjs().year(year).month(month).date(1);
  const lastDayOfMonth = firstDayOfMonth.endOf('month');
  const startDate = firstDayOfMonth.startOf('week');
  const endDate = lastDayOfMonth.endOf('week');
  
  const days: CalendarDay[] = [];
  let current = startDate;
  
  while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
    days.push({
      date: current.date(),
      isCurrentMonth: current.month() === month,
      fullDate: current.format('YYYY-MM-DD')
    });
    current = current.add(1, 'day');
  }
  
  return days;
};