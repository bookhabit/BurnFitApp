import dayjs from 'dayjs';
import 'dayjs/locale/ko';

// 한국어 로케일 설정
dayjs.locale('ko');

export interface CalendarDay {
  date: dayjs.Dayjs;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  dayOfWeek: number; // 0: 일요일, 1: 월요일, ..., 6: 토요일
}

export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  weeks: CalendarWeek[];
  totalDays: number;
}

export interface CalendarData {
  currentDate: dayjs.Dayjs;
  selectedDate: dayjs.Dayjs;
  monthView: CalendarMonth;
  weekView: CalendarWeek[];
}

/**
 * 오늘 날짜를 반환합니다.
 */
export const getToday = (): dayjs.Dayjs => {
  return dayjs();
};

/**
 * 특정 날짜가 오늘인지 확인합니다.
 */
export const isToday = (date: dayjs.Dayjs): boolean => {
  return date.isSame(dayjs(), 'day');
};

/**
 * 특정 날짜가 선택된 날짜인지 확인합니다.
 */
export const isSelectedDate = (
  date: dayjs.Dayjs,
  selectedDate: dayjs.Dayjs,
): boolean => {
  return date.isSame(selectedDate, 'day');
};

/**
 * 월의 첫 번째 날짜를 반환합니다.
 */
export const getFirstDayOfMonth = (
  year: number,
  month: number,
): dayjs.Dayjs => {
  return dayjs().year(year).month(month).date(1);
};

/**
 * 월의 마지막 날짜를 반환합니다.
 */
export const getLastDayOfMonth = (year: number, month: number): dayjs.Dayjs => {
  return dayjs().year(year).month(month).endOf('month');
};

/**
 * 월의 총 일수를 반환합니다.
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return dayjs().year(year).month(month).daysInMonth();
};

/**
 * 월의 첫 번째 주의 시작일을 반환합니다 (일요일부터 시작).
 */
export const getFirstDayOfWeek = (year: number, month: number): dayjs.Dayjs => {
  const firstDay = getFirstDayOfMonth(year, month);
  const dayOfWeek = firstDay.day(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
  return firstDay.subtract(dayOfWeek, 'day');
};

/**
 * 월 캘린더 데이터를 생성합니다.
 */
export const generateMonthCalendar = (
  year: number,
  month: number,
  selectedDate: dayjs.Dayjs,
): CalendarMonth => {
  const firstDayOfWeek = getFirstDayOfWeek(year, month);
  const daysInMonth = getDaysInMonth(year, month);

  const weeks: CalendarWeek[] = [];
  let currentWeek: CalendarDay[] = [];
  let weekNumber = 1;

  // 첫 번째 주의 이전 달 날짜들
  let currentDate = firstDayOfWeek;
  while (currentDate.isBefore(getFirstDayOfMonth(year, month), 'day')) {
    currentWeek.push({
      date: currentDate,
      day: currentDate.date(),
      month: currentDate.month(),
      year: currentDate.year(),
      isCurrentMonth: false,
      isToday: isToday(currentDate),
      isSelected: isSelectedDate(currentDate, selectedDate),
      dayOfWeek: currentDate.day(),
    });

    if (currentWeek.length === 7) {
      weeks.push({weekNumber: weekNumber++, days: [...currentWeek]});
      currentWeek = [];
    }

    currentDate = currentDate.add(1, 'day');
  }

  // 현재 달의 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    const date = dayjs().year(year).month(month).date(day);
    currentWeek.push({
      date: date,
      day: day,
      month: month,
      year: year,
      isCurrentMonth: true,
      isToday: isToday(date),
      isSelected: isSelectedDate(date, selectedDate),
      dayOfWeek: date.day(),
    });

    if (currentWeek.length === 7) {
      weeks.push({weekNumber: weekNumber++, days: [...currentWeek]});
      currentWeek = [];
    }
  }

  // 마지막 주의 다음 달 날짜들
  while (currentWeek.length < 7) {
    currentWeek.push({
      date: currentDate,
      day: currentDate.date(),
      month: currentDate.month(),
      year: currentDate.year(),
      isCurrentMonth: false,
      isToday: isToday(currentDate),
      isSelected: isSelectedDate(currentDate, selectedDate),
      dayOfWeek: currentDate.day(),
    });
    currentDate = currentDate.add(1, 'day');
  }

  if (currentWeek.length > 0) {
    weeks.push({weekNumber: weekNumber, days: currentWeek});
  }

  return {
    year,
    month,
    weeks,
    totalDays: daysInMonth,
  };
};

/**
 * 이전 달로 이동합니다.
 */
export const getPreviousMonth = (
  year: number,
  month: number,
): {year: number; month: number} => {
  const prevMonth = dayjs().year(year).month(month).subtract(1, 'month');
  return {year: prevMonth.year(), month: prevMonth.month()};
};

/**
 * 다음 달로 이동합니다.
 */
export const getNextMonth = (
  year: number,
  month: number,
): {year: number; month: number} => {
  const nextMonth = dayjs().year(year).month(month).add(1, 'month');
  return {year: nextMonth.year(), month: nextMonth.month()};
};

/**
 * 이전 주로 이동합니다.
 */
export const getPreviousWeek = (
  year: number,
  month: number,
  weekNumber: number,
): {year: number; month: number; weekNumber: number} => {
  if (weekNumber === 1) {
    const prevMonth = getPreviousMonth(year, month);
    const prevMonthCalendar = generateMonthCalendar(
      prevMonth.year,
      prevMonth.month,
      dayjs(),
    );
    return {
      year: prevMonth.year,
      month: prevMonth.month,
      weekNumber: prevMonthCalendar.weeks.length,
    };
  }
  return {year, month, weekNumber: weekNumber - 1};
};

/**
 * 다음 주로 이동합니다.
 */
export const getNextWeek = (
  year: number,
  month: number,
  weekNumber: number,
): {year: number; month: number; weekNumber: number} => {
  const currentMonthCalendar = generateMonthCalendar(year, month, dayjs());
  if (weekNumber === currentMonthCalendar.weeks.length) {
    const nextMonth = getNextMonth(year, month);
    return {
      year: nextMonth.year,
      month: nextMonth.month,
      weekNumber: 1,
    };
  }
  return {year, month, weekNumber: weekNumber + 1};
};

/**
 * 현재 날짜를 기준으로 초기 캘린더 데이터를 생성합니다.
 */
export const getInitialCalendarData = (): CalendarData => {
  const today = getToday();
  const selectedDate = today;
  const year = today.year();
  const month = today.month();

  return {
    currentDate: today,
    selectedDate: selectedDate,
    monthView: generateMonthCalendar(year, month, selectedDate),
    weekView: generateMonthCalendar(year, month, selectedDate).weeks,
  };
};

/**
 * 월 이름을 한국어로 반환합니다.
 */
export const getMonthName = (month: number): string => {
  return dayjs().month(month).format('M월');
};

/**
 * 요일 이름을 한국어로 반환합니다.
 */
export const getDayName = (dayOfWeek: number): string => {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  return dayNames[dayOfWeek];
};

/**
 * 날짜를 포맷팅합니다.
 */
export const formatDate = (
  date: dayjs.Dayjs,
  format: string = 'YYYY-MM-DD',
): string => {
  return date.format(format);
};

/**
 * 두 날짜 간의 차이를 계산합니다.
 */
export const getDateDifference = (
  date1: dayjs.Dayjs,
  date2: dayjs.Dayjs,
  unit: dayjs.ManipulateType = 'day',
): number => {
  return date1.diff(date2, unit);
};
