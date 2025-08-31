import { act, renderHook } from "@testing-library/react-native";
import dayjs from "dayjs";
import { useCalendar } from "../../hooks/useCalendar";

describe("useCalendar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("초기 상태", () => {
    test("초기 상태가 올바르게 설정되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      expect(result.current.calendarData.currentDate).toBeDefined();
      expect(result.current.calendarData.selectedDate).toBeDefined();
      expect(result.current.calendarData.monthView).toBeDefined();
      expect(result.current.calendarData.weekView).toBeDefined();
      expect(result.current.currentView).toBe("month");
      expect(result.current.currentWeekNumber).toBe(1);
    });
  });

  describe("날짜 이동 기능", () => {
    test("TC-CAL-006: 이전 달로 이동 시 올바른 월과 연도가 표시되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const initialYear = result.current.calendarData.monthView.year;
      const initialMonth = result.current.calendarData.monthView.month;

      act(() => {
        result.current.goToPreviousMonth();
      });

      const newYear = result.current.calendarData.monthView.year;
      const newMonth = result.current.calendarData.monthView.month;

      if (initialMonth === 0) {
        expect(newYear).toBe(initialYear - 1);
        expect(newMonth).toBe(11);
      } else {
        expect(newYear).toBe(initialYear);
        expect(newMonth).toBe(initialMonth - 1);
      }
    });

    test("TC-CAL-007: 다음 달로 이동 시 올바른 월과 연도가 표시되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const initialYear = result.current.calendarData.monthView.year;
      const initialMonth = result.current.calendarData.monthView.month;

      act(() => {
        result.current.goToNextMonth();
      });

      const newYear = result.current.calendarData.monthView.year;
      const newMonth = result.current.calendarData.monthView.month;

      if (initialMonth === 11) {
        expect(newYear).toBe(initialYear + 1);
        expect(newMonth).toBe(0);
      } else {
        expect(newYear).toBe(initialYear);
        expect(newMonth).toBe(initialMonth + 1);
      }
    });

    test("TC-CAL-008: 이전 주로 이동 시 올바른 주가 표시되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const initialWeekNumber = result.current.currentWeekNumber;

      act(() => {
        result.current.goToPreviousWeek();
      });

      if (initialWeekNumber === 1) {
        // 첫 번째 주에서 이전 주로 이동하면 이전 달의 마지막 주로 이동
        expect(result.current.currentWeekNumber).toBeGreaterThan(1);
      } else {
        expect(result.current.currentWeekNumber).toBe(initialWeekNumber - 1);
      }
    });

    test("TC-CAL-009: 다음 주로 이동 시 올바른 주가 표시되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const initialWeekNumber = result.current.currentWeekNumber;
      const totalWeeks = result.current.calendarData.monthView.weeks.length;

      act(() => {
        result.current.goToNextWeek();
      });

      if (initialWeekNumber === totalWeeks) {
        // 마지막 주에서 다음 주로 이동하면 다음 달의 첫 번째 주로 이동
        expect(result.current.currentWeekNumber).toBe(1);
      } else {
        expect(result.current.currentWeekNumber).toBe(initialWeekNumber + 1);
      }
    });

    test("TC-CAL-010: 오늘 날짜로 이동 시 현재 날짜가 올바르게 선택되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const today = dayjs();

      act(() => {
        result.current.goToToday();
      });

      expect(result.current.calendarData.currentDate.isSame(today, "day")).toBe(
        true
      );
      expect(
        result.current.calendarData.selectedDate.isSame(today, "day")
      ).toBe(true);
    });
  });

  describe("날짜 선택 기능", () => {
    test("TC-CAL-011: 현재 월의 날짜 선택 시 올바르게 선택 상태가 표시되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const today = dayjs();
      const targetDate = today.date(15); // 같은 월의 15일

      act(() => {
        result.current.selectDate(targetDate);
      });

      expect(
        result.current.calendarData.selectedDate.isSame(targetDate, "day")
      ).toBe(true);
    });

    test("TC-CAL-012: 다른 월의 날짜 선택 시 해당 월로 자동 이동되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const currentMonth = result.current.calendarData.monthView.month;
      const nextMonth = (currentMonth + 1) % 12;
      const nextMonthDate = dayjs().month(nextMonth).date(15);

      act(() => {
        result.current.selectDate(nextMonthDate);
      });

      expect(result.current.calendarData.monthView.month).toBe(nextMonth);
      expect(
        result.current.calendarData.selectedDate.isSame(nextMonthDate, "day")
      ).toBe(true);
    });

    test("TC-CAL-013: 오늘 날짜가 올바르게 하이라이트되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const today = dayjs();
      const todayWeek = result.current.calendarData.monthView.weeks.find(
        (week) => week.days.some((day) => day.isToday)
      );

      expect(todayWeek).toBeDefined();
      expect(todayWeek!.days.some((day) => day.isToday)).toBe(true);
    });

    test("TC-CAL-014: 선택된 날짜가 올바르게 표시되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const targetDate = dayjs().date(20);

      act(() => {
        result.current.selectDate(targetDate);
      });

      const selectedWeek = result.current.calendarData.monthView.weeks.find(
        (week) => week.days.some((day) => day.isSelected)
      );

      expect(selectedWeek).toBeDefined();
      expect(selectedWeek!.days.some((day) => day.isSelected)).toBe(true);
    });
  });

  describe("뷰 변경 기능", () => {
    test("TC-CAL-015: 월 뷰에서 주 뷰로 변경 시 올바르게 표시되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      act(() => {
        result.current.changeView("week");
      });

      expect(result.current.currentView).toBe("week");
    });

    test("TC-CAL-016: 주 뷰에서 월 뷰로 변경 시 올바르게 표시되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      // 먼저 주 뷰로 변경
      act(() => {
        result.current.changeView("week");
      });

      expect(result.current.currentView).toBe("week");

      // 다시 월 뷰로 변경
      act(() => {
        result.current.changeView("month");
      });

      expect(result.current.currentView).toBe("month");
    });
  });

  describe("특정 날짜/월/주 이동", () => {
    test("TC-CAL-017: 특정 연도와 월로 이동 시 올바른 캘린더가 표시되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const targetYear = 2025;
      const targetMonth = 5; // 6월 (0-based)

      act(() => {
        result.current.goToMonth(targetYear, targetMonth);
      });

      expect(result.current.calendarData.monthView.year).toBe(targetYear);
      expect(result.current.calendarData.monthView.month).toBe(targetMonth);
    });

    test("TC-CAL-018: 특정 날짜로 이동 시 올바른 날짜가 선택되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const targetYear = 2024;
      const targetMonth = 5; // 6월 (0-based)
      const targetDay = 15;

      act(() => {
        result.current.goToDate(targetYear, targetMonth, targetDay);
      });

      expect(result.current.calendarData.selectedDate.year()).toBe(targetYear);
      expect(result.current.calendarData.selectedDate.month()).toBe(
        targetMonth
      );
      expect(result.current.calendarData.selectedDate.date()).toBe(targetDay);
    });

    test("TC-CAL-019: 특정 주로 이동 시 올바른 주가 표시되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const targetYear = 2024;
      const targetMonth = 5; // 6월 (0-based)
      const targetWeek = 2;

      act(() => {
        result.current.goToWeek(targetYear, targetMonth, targetWeek);
      });

      expect(result.current.currentWeekNumber).toBe(targetWeek);
    });
  });

  describe("캘린더 데이터 업데이트", () => {
    test("날짜 선택 시 monthView와 weekView가 올바르게 업데이트되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const targetDate = dayjs().date(25);

      act(() => {
        result.current.selectDate(targetDate);
      });

      // monthView와 weekView가 동기화되어 있는지 확인
      expect(result.current.calendarData.monthView.weeks).toEqual(
        result.current.calendarData.weekView
      );
    });

    test("월 이동 시 weekView가 올바르게 업데이트되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const initialWeekView = result.current.calendarData.weekView;

      act(() => {
        result.current.goToNextMonth();
      });

      // weekView가 변경되었는지 확인
      expect(result.current.calendarData.weekView).not.toEqual(initialWeekView);
    });
  });

  describe("뷰 변경 시 선택된 날짜/오늘 날짜 표시", () => {
    test("TC-CAL-020: 주 뷰로 변경 시 선택된 날짜 기준의 주가 표시되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const targetDate = dayjs().date(10); // 10일
      const selectedDate = dayjs().date(15); // 15일

      act(() => {
        result.current.selectDate(selectedDate);
      });

      act(() => {
        result.current.changeView("week");
      });

      const selectedWeek = result.current.calendarData.monthView.weeks.find(
        (week) => week.days.some((day) => day.isSelected)
      );

      expect(selectedWeek).toBeDefined();
      expect(selectedWeek!.days.some((day) => day.isSelected)).toBe(true);
      expect(
        selectedWeek!.days.some((day) => day.date.isSame(selectedDate, "day"))
      ).toBe(true);
    });

    test("TC-CAL-021: 주 뷰로 변경 시 오늘 날짜 기준의 주가 표시되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const today = dayjs();
      const todayWeek = result.current.calendarData.monthView.weeks.find(
        (week) => week.days.some((day) => day.isToday)
      );

      act(() => {
        result.current.changeView("week");
      });

      expect(result.current.currentView).toBe("week");
      expect(todayWeek).toBeDefined();
      expect(todayWeek!.days.some((day) => day.isToday)).toBe(true);
    });

    test("TC-CAL-022: 주 뷰로 변경 시 우선순위가 올바르게 적용되는지 확인", () => {
      const { result } = renderHook(() => useCalendar());

      const selectedDate = dayjs().date(15); // 15일
      const today = dayjs();

      act(() => {
        result.current.selectDate(selectedDate);
      });

      act(() => {
        result.current.changeView("week");
      });

      const selectedWeek = result.current.calendarData.monthView.weeks.find(
        (week) => week.days.some((day) => day.isSelected)
      );

      expect(selectedWeek).toBeDefined();
      expect(selectedWeek!.days.some((day) => day.isSelected)).toBe(true);
      expect(
        selectedWeek!.days.some((day) => day.date.isSame(selectedDate, "day"))
      ).toBe(true);

      act(() => {
        result.current.changeView("month");
      });

      expect(result.current.currentView).toBe("month");

      act(() => {
        result.current.changeView("week");
      });

      expect(result.current.currentView).toBe("week");
      expect(selectedWeek).toBeDefined();
      expect(selectedWeek!.days.some((day) => day.isSelected)).toBe(true);
    });
  });
});
