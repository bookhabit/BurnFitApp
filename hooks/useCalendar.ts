import {
  CalendarData,
  generateMonthCalendar,
  getNextMonth,
  getNextWeek,
  getPreviousMonth,
  getPreviousWeek,
} from "@/lib/calendarUtils";
import dayjs from "dayjs";
import { useCallback, useState } from "react";

export const useCalendar = () => {
  const [calendarData, setCalendarData] = useState<CalendarData>(() => {
    const today = dayjs();
    const year = today.year();
    const month = today.month();

    return {
      currentDate: today,
      selectedDate: today,
      monthView: generateMonthCalendar(year, month, today),
      weekView: generateMonthCalendar(year, month, today).weeks,
    };
  });

  const [currentView, setCurrentView] = useState<"month" | "week">("month");
  const [currentWeekNumber, setCurrentWeekNumber] = useState(1);

  /**
   * 이전 달로 이동
   */
  const goToPreviousMonth = useCallback(() => {
    setCalendarData((prev) => {
      const { year, month } = getPreviousMonth(
        prev.monthView.year,
        prev.monthView.month
      );
      const newMonthView = generateMonthCalendar(
        year,
        month,
        prev.selectedDate
      );

      return {
        ...prev,
        monthView: newMonthView,
        weekView: newMonthView.weeks,
      };
    });
  }, []);

  /**
   * 다음 달로 이동
   */
  const goToNextMonth = useCallback(() => {
    setCalendarData((prev) => {
      const { year, month } = getNextMonth(
        prev.monthView.year,
        prev.monthView.month
      );
      const newMonthView = generateMonthCalendar(
        year,
        month,
        prev.selectedDate
      );

      return {
        ...prev,
        monthView: newMonthView,
        weekView: newMonthView.weeks,
      };
    });
  }, []);

  /**
   * 이전 주로 이동
   */
  const goToPreviousWeek = useCallback(() => {
    setCalendarData((prev) => {
      const { year, month, weekNumber } = getPreviousWeek(
        prev.monthView.year,
        prev.monthView.month,
        currentWeekNumber
      );

      const newMonthView = generateMonthCalendar(
        year,
        month,
        prev.selectedDate
      );
      const newWeekNumber = weekNumber;

      setCurrentWeekNumber(newWeekNumber);

      return {
        ...prev,
        monthView: newMonthView,
        weekView: newMonthView.weeks,
      };
    });
  }, [currentWeekNumber]);

  /**
   * 다음 주로 이동
   */
  const goToNextWeek = useCallback(() => {
    setCalendarData((prev) => {
      const { year, month, weekNumber } = getNextWeek(
        prev.monthView.year,
        prev.monthView.month,
        currentWeekNumber
      );

      const newMonthView = generateMonthCalendar(
        year,
        month,
        prev.selectedDate
      );
      const newWeekNumber = weekNumber;

      setCurrentWeekNumber(newWeekNumber);

      return {
        ...prev,
        monthView: newMonthView,
        weekView: newMonthView.weeks,
      };
    });
  }, [currentWeekNumber]);

  /**
   * 날짜 선택
   */
  const selectDate = useCallback((date: dayjs.Dayjs) => {
    const selectedDate = date.clone();

    setCalendarData((prev) => {
      const year = selectedDate.year();
      const month = selectedDate.month();

      // 선택된 날짜가 현재 표시된 월과 다른 경우 월을 업데이트
      if (year !== prev.monthView.year || month !== prev.monthView.month) {
        const newMonthView = generateMonthCalendar(year, month, selectedDate);
        return {
          ...prev,
          selectedDate,
          monthView: newMonthView,
          weekView: newMonthView.weeks,
        };
      }

      // 같은 월 내에서 날짜만 선택
      const newMonthView = generateMonthCalendar(year, month, selectedDate);
      return {
        ...prev,
        selectedDate,
        monthView: newMonthView,
        weekView: newMonthView.weeks,
      };
    });
  }, []);

  /**
   * 오늘 날짜로 이동
   */
  const goToToday = useCallback(() => {
    const today = dayjs();
    const year = today.year();
    const month = today.month();

    setCalendarData((prev) => {
      const newMonthView = generateMonthCalendar(year, month, today);

      // 오늘 날짜가 속한 주 찾기
      const todayWeek = newMonthView.weeks.find((week) =>
        week.days.some((day) => day.isToday)
      );

      if (todayWeek) {
        setCurrentWeekNumber(todayWeek.weekNumber);
      }

      return {
        ...prev,
        currentDate: today,
        selectedDate: today,
        monthView: newMonthView,
        weekView: newMonthView.weeks,
      };
    });
  }, []);

  /**
   * 뷰 변경 (월/주)
   */
  const changeView = useCallback((view: "month" | "week") => {
    setCurrentView(view);

    // 주 뷰로 변환할 때 우선순위 적용
    if (view === "week") {
      setCalendarData((prev) => {
        const { monthView, selectedDate, currentDate } = prev;

        // 1. 선택된 날짜가 해당 월에 있으면 선택된 날짜 기준의 주
        if (
          selectedDate.year() === monthView.year &&
          selectedDate.month() === monthView.month
        ) {
          const targetWeek = monthView.weeks.find((week) =>
            week.days.some((d) => d.date.isSame(selectedDate, "day"))
          );
          if (targetWeek) {
            setCurrentWeekNumber(targetWeek.weekNumber);
            return prev;
          }
        }

        // 2. 오늘 날짜가 해당 월에 있으면 오늘 날짜 기준의 주
        if (
          currentDate.year() === monthView.year &&
          currentDate.month() === monthView.month
        ) {
          const targetWeek = monthView.weeks.find((week) =>
            week.days.some((d) => d.date.isSame(currentDate, "day"))
          );
          if (targetWeek) {
            setCurrentWeekNumber(targetWeek.weekNumber);
            return prev;
          }
        }

        // 3. 둘 다 없으면 첫 번째 주
        setCurrentWeekNumber(1);
        return prev;
      });
    }
  }, []);

  /**
   * 특정 월로 이동
   */
  const goToMonth = useCallback((year: number, month: number) => {
    setCalendarData((prev) => {
      const newMonthView = generateMonthCalendar(
        year,
        month,
        prev.selectedDate
      );

      return {
        ...prev,
        monthView: newMonthView,
        weekView: newMonthView.weeks,
      };
    });
  }, []);

  /**
   * 특정 날짜로 이동 (연도, 월, 일)
   */
  const goToDate = useCallback(
    (year: number, month: number, day: number = 1) => {
      const targetDate = dayjs().year(year).month(month).date(day);

      setCalendarData((prev) => {
        const newMonthView = generateMonthCalendar(year, month, targetDate);

        // 해당 날짜가 속한 주 찾기
        const targetWeek = newMonthView.weeks.find((week) =>
          week.days.some((d) => d.date.isSame(targetDate, "day"))
        );

        if (targetWeek) {
          setCurrentWeekNumber(targetWeek.weekNumber);
        }

        return {
          ...prev,
          monthView: newMonthView,
          weekView: newMonthView.weeks,
          selectedDate: targetDate,
        };
      });
    },
    []
  );

  /**
   * 특정 주로 이동
   */
  const goToWeek = useCallback(
    (year: number, month: number, weekNumber: number) => {
      setCalendarData((prev) => {
        const newMonthView = generateMonthCalendar(
          year,
          month,
          prev.selectedDate
        );
        setCurrentWeekNumber(weekNumber);

        return {
          ...prev,
          monthView: newMonthView,
          weekView: newMonthView.weeks,
        };
      });
    },
    []
  );

  return {
    calendarData,
    currentView,
    currentWeekNumber,
    goToPreviousMonth,
    goToNextMonth,
    goToPreviousWeek,
    goToNextWeek,
    selectDate,
    goToToday,
    changeView,
    goToMonth,
    goToWeek,
    goToDate,
  };
};
