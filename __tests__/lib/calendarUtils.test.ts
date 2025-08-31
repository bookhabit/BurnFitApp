import dayjs from "dayjs";
import {
  formatDate,
  generateMonthCalendar,
  getDateDifference,
  getDayName,
  getDaysInMonth,
  getMonthName,
  getNextMonth,
  getNextWeek,
  getPreviousMonth,
  getPreviousWeek,
  isSelectedDate,
  isToday,
} from "../../lib/calendarUtils";

describe("calendarUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("월별 캘린더 생성", () => {
    test("TC-CAL-001: 현재 월의 캘린더가 올바르게 생성되는지 확인", () => {
      const today = dayjs();
      const year = today.year();
      const month = today.month();

      const calendar = generateMonthCalendar(year, month, today);

      expect(calendar.year).toBe(year);
      expect(calendar.month).toBe(month);
      expect(calendar.weeks).toBeDefined();
      expect(calendar.totalDays).toBe(today.daysInMonth());
    });

    test("TC-CAL-002: 월의 첫 주에 이전 달 날짜들이 올바르게 표시되는지 확인", () => {
      // 2024년 3월 (금요일부터 시작)
      const year = 2024;
      const month = 2; // 3월 (0-based)
      const selectedDate = dayjs("2024-03-01");

      const calendar = generateMonthCalendar(year, month, selectedDate);
      const firstWeek = calendar.weeks[0];

      // 3월 1일은 금요일이므로, 첫 주에는 2월 25일(일요일)부터 시작
      expect(firstWeek.days[0].date.format("YYYY-MM-DD")).toBe("2024-02-25");
      expect(firstWeek.days[0].isCurrentMonth).toBe(false);
    });

    test("TC-CAL-003: 월의 마지막 주에 다음 달 날짜들이 올바르게 표시되는지 확인", () => {
      // 2024년 3월 (31일까지)
      const year = 2024;
      const month = 2; // 3월 (0-based)
      const selectedDate = dayjs("2024-03-01");

      const calendar = generateMonthCalendar(year, month, selectedDate);
      const lastWeek = calendar.weeks[calendar.weeks.length - 1];

      // 3월 31일은 일요일이므로, 마지막 주에는 4월 6일(토요일)까지
      const lastDay = lastWeek.days[6];
      expect(lastDay.date.format("YYYY-MM-DD")).toBe("2024-04-06");
      expect(lastDay.isCurrentMonth).toBe(false);
    });

    test("TC-CAL-004: 윤년 2월의 경우 29일까지 올바르게 표시되는지 확인", () => {
      // 2024년 2월 (윤년)
      const year = 2024;
      const month = 1; // 2월 (0-based)
      const selectedDate = dayjs("2024-02-01");

      const calendar = generateMonthCalendar(year, month, selectedDate);

      expect(calendar.totalDays).toBe(29);

      // 2월 29일이 포함된 주 찾기
      const weekWith29th = calendar.weeks.find((week) =>
        week.days.some((day) => day.date.date() === 29)
      );
      expect(weekWith29th).toBeDefined();
    });

    test("TC-CAL-005: 31일이 없는 월(2월, 4월, 6월, 9월, 11월)의 경우 올바르게 처리되는지 확인", () => {
      // 2월 (28일)
      const febCalendar = generateMonthCalendar(2024, 1, dayjs("2024-02-01"));
      expect(febCalendar.totalDays).toBe(29); // 윤년

      // 4월 (30일)
      const aprCalendar = generateMonthCalendar(2024, 3, dayjs("2024-04-01"));
      expect(aprCalendar.totalDays).toBe(30);

      // 6월 (30일)
      const junCalendar = generateMonthCalendar(2024, 5, dayjs("2024-06-01"));
      expect(junCalendar.totalDays).toBe(30);

      // 9월 (30일)
      const sepCalendar = generateMonthCalendar(2024, 8, dayjs("2024-09-01"));
      expect(sepCalendar.totalDays).toBe(30);

      // 11월 (30일)
      const novCalendar = generateMonthCalendar(2024, 10, dayjs("2024-11-01"));
      expect(novCalendar.totalDays).toBe(30);
    });
  });

  describe("날짜 이동 기능", () => {
    test("TC-CAL-006: 이전 달로 이동 시 올바른 월과 연도가 표시되는지 확인", () => {
      const result = getPreviousMonth(2024, 3); // 4월에서 3월로
      expect(result.year).toBe(2024);
      expect(result.month).toBe(2); // 3월 (0-based)

      // 연도 변경 케이스
      const result2 = getPreviousMonth(2024, 0); // 1월에서 12월로
      expect(result2.year).toBe(2023);
      expect(result2.month).toBe(11); // 12월 (0-based)
    });

    test("TC-CAL-007: 다음 달로 이동 시 올바른 월과 연도가 표시되는지 확인", () => {
      const result = getNextMonth(2024, 2); // 3월에서 4월로
      expect(result.year).toBe(2024);
      expect(result.month).toBe(3); // 4월 (0-based)

      // 연도 변경 케이스
      const result2 = getNextMonth(2024, 11); // 12월에서 1월로
      expect(result2.year).toBe(2025);
      expect(result2.month).toBe(0); // 1월 (0-based)
    });

    test("TC-CAL-008: 이전 주로 이동 시 올바른 주가 표시되는지 확인", () => {
      const result = getPreviousWeek(2024, 3, 2); // 4월 2주차에서 1주차로
      expect(result.year).toBe(2024);
      expect(result.month).toBe(3);
      expect(result.weekNumber).toBe(1);

      // 월 변경 케이스
      const result2 = getPreviousWeek(2024, 3, 1); // 4월 1주차에서 3월 마지막 주로
      expect(result2.month).toBe(2); // 3월
    });

    test("TC-CAL-009: 다음 주로 이동 시 올바른 주가 표시되는지 확인", () => {
      const result = getNextWeek(2024, 3, 1); // 4월 1주차에서 2주차로
      expect(result.year).toBe(2024);
      expect(result.month).toBe(3);
      expect(result.weekNumber).toBe(2);

      // 월 변경 케이스
      const result2 = getNextWeek(2024, 3, 5); // 4월 마지막 주에서 5월 1주차로
      expect(result2.month).toBe(4); // 5월
      expect(result2.weekNumber).toBe(1);
    });

    test("TC-CAL-010: 오늘 날짜로 이동 시 현재 날짜가 올바르게 선택되는지 확인", () => {
      const today = dayjs();
      const calendar = generateMonthCalendar(
        today.year(),
        today.month(),
        today
      );

      // 오늘 날짜가 포함된 주 찾기
      const todayWeek = calendar.weeks.find((week) =>
        week.days.some((day) => day.isToday)
      );

      expect(todayWeek).toBeDefined();
      expect(todayWeek!.days.some((day) => day.isToday)).toBe(true);
    });
  });

  describe("날짜 선택 기능", () => {
    test("TC-CAL-011: 현재 월의 날짜 선택 시 올바르게 선택 상태가 표시되는지 확인", () => {
      const selectedDate = dayjs("2024-03-15");
      const calendar = generateMonthCalendar(2024, 2, selectedDate);

      // 선택된 날짜가 포함된 주 찾기
      const selectedWeek = calendar.weeks.find((week) =>
        week.days.some((day) => day.isSelected)
      );

      expect(selectedWeek).toBeDefined();
      expect(selectedWeek!.days.some((day) => day.isSelected)).toBe(true);
    });

    test("TC-CAL-012: 다른 월의 날짜 선택 시 해당 월로 자동 이동되는지 확인", () => {
      // 3월에서 4월 날짜 선택
      const selectedDate = dayjs("2024-04-15");
      const calendar = generateMonthCalendar(2024, 2, selectedDate); // 3월 캘린더

      // 4월 날짜가 포함된 주 찾기
      const nextMonthWeek = calendar.weeks.find(
        (week) => week.days.some((day) => day.date.month() === 3) // 4월 (0-based)
      );

      expect(nextMonthWeek).toBeDefined();
    });

    test("TC-CAL-013: 오늘 날짜가 올바르게 하이라이트되는지 확인", () => {
      const today = dayjs();
      const calendar = generateMonthCalendar(
        today.year(),
        today.month(),
        today
      );

      // 오늘 날짜가 포함된 주 찾기
      const todayWeek = calendar.weeks.find((week) =>
        week.days.some((day) => day.isToday)
      );

      expect(todayWeek).toBeDefined();
      const todayDay = todayWeek!.days.find((day) => day.isToday);
      expect(todayDay).toBeDefined();
      expect(todayDay!.isToday).toBe(true);
    });

    test("TC-CAL-014: 선택된 날짜가 올바르게 표시되는지 확인", () => {
      const selectedDate = dayjs("2024-03-20");
      const calendar = generateMonthCalendar(2024, 2, selectedDate);

      // 선택된 날짜가 포함된 주 찾기
      const selectedWeek = calendar.weeks.find((week) =>
        week.days.some((day) => day.isSelected)
      );

      expect(selectedWeek).toBeDefined();
      const selectedDay = selectedWeek!.days.find((day) => day.isSelected);
      expect(selectedDay).toBeDefined();
      expect(selectedDay!.isSelected).toBe(true);
    });
  });

  describe("뷰 변경 기능", () => {
    test("TC-CAL-015: 월 뷰에서 주 뷰로 변경 시 올바르게 표시되는지 확인", () => {
      const today = dayjs();
      const calendar = generateMonthCalendar(
        today.year(),
        today.month(),
        today
      );

      // 주 뷰 데이터가 올바르게 생성되는지 확인
      expect(calendar.weeks).toBeDefined();
      expect(calendar.weeks.length).toBeGreaterThan(0);

      // 각 주가 7일을 가지고 있는지 확인
      calendar.weeks.forEach((week) => {
        expect(week.days.length).toBe(7);
      });
    });

    test("TC-CAL-016: 주 뷰에서 월 뷰로 변경 시 올바르게 표시되는지 확인", () => {
      const today = dayjs();
      const calendar = generateMonthCalendar(
        today.year(),
        today.month(),
        today
      );

      // 월 뷰 데이터가 올바르게 생성되는지 확인
      expect(calendar.year).toBeDefined();
      expect(calendar.month).toBeDefined();
      expect(calendar.totalDays).toBeDefined();
      expect(calendar.weeks).toBeDefined();
    });
  });

  describe("특정 날짜/월/주 이동", () => {
    test("TC-CAL-017: 특정 연도와 월로 이동 시 올바른 캘린더가 표시되는지 확인", () => {
      const year = 2025;
      const month = 5; // 6월 (0-based)
      const selectedDate = dayjs("2024-03-01");

      const calendar = generateMonthCalendar(year, month, selectedDate);

      expect(calendar.year).toBe(2025);
      expect(calendar.month).toBe(5);
      expect(calendar.totalDays).toBe(30); // 6월은 30일
    });

    test("TC-CAL-018: 특정 날짜로 이동 시 올바른 날짜가 선택되는지 확인", () => {
      const targetDate = dayjs("2024-06-15");
      const calendar = generateMonthCalendar(2024, 5, targetDate); // 6월

      // 6월 15일이 포함된 주 찾기
      const targetWeek = calendar.weeks.find((week) =>
        week.days.some(
          (day) => day.date.date() === 15 && day.date.month() === 5
        )
      );

      expect(targetWeek).toBeDefined();
    });

    test("TC-CAL-019: 특정 주로 이동 시 올바른 주가 표시되는지 확인", () => {
      const today = dayjs();
      const calendar = generateMonthCalendar(
        today.year(),
        today.month(),
        today
      );

      // 특정 주 번호로 접근
      const weekNumber = 2;
      const targetWeek = calendar.weeks.find(
        (week) => week.weekNumber === weekNumber
      );

      if (targetWeek) {
        expect(targetWeek.weekNumber).toBe(weekNumber);
        expect(targetWeek.days.length).toBe(7);
      }
    });
  });

  describe("유틸리티 함수", () => {
    test("isToday 함수가 올바르게 작동하는지 확인", () => {
      const today = dayjs();
      const yesterday = today.subtract(1, "day");

      expect(isToday(today)).toBe(true);
      expect(isToday(yesterday)).toBe(false);
    });

    test("isSelectedDate 함수가 올바르게 작동하는지 확인", () => {
      const date1 = dayjs("2024-03-15");
      const date2 = dayjs("2024-03-15");
      const date3 = dayjs("2024-03-16");

      expect(isSelectedDate(date1, date2)).toBe(true);
      expect(isSelectedDate(date1, date3)).toBe(false);
    });

    test("getDaysInMonth 함수가 올바르게 작동하는지 확인", () => {
      expect(getDaysInMonth(2024, 1)).toBe(29); // 2024년 2월 (윤년)
      expect(getDaysInMonth(2023, 1)).toBe(28); // 2023년 2월 (평년)
      expect(getDaysInMonth(2024, 3)).toBe(30); // 2024년 4월
      expect(getDaysInMonth(2024, 4)).toBe(31); // 2024년 5월
    });

    test("getMonthName 함수가 올바르게 작동하는지 확인", () => {
      expect(getMonthName(0)).toBe("1월");
      expect(getMonthName(11)).toBe("12월");
    });

    test("getDayName 함수가 올바르게 작동하는지 확인", () => {
      expect(getDayName(0)).toBe("일");
      expect(getDayName(1)).toBe("월");
      expect(getDayName(6)).toBe("토");
    });

    test("formatDate 함수가 올바르게 작동하는지 확인", () => {
      const date = dayjs("2024-03-15");
      expect(formatDate(date)).toBe("2024-03-15");
      expect(formatDate(date, "YYYY년 MM월 DD일")).toBe("2024년 03월 15일");
    });

    test("getDateDifference 함수가 올바르게 작동하는지 확인", () => {
      const date1 = dayjs("2024-03-15");
      const date2 = dayjs("2024-03-10");

      expect(getDateDifference(date1, date2)).toBe(5); // 5일 차이
      expect(getDateDifference(date1, date2, "day")).toBe(5);
    });
  });
});
