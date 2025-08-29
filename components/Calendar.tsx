import Entypo from '@expo/vector-icons/Entypo';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { darkTheme, lightTheme } from '../constants/colors';
import { useCalendar } from '../hooks/useCalendar';
import { CalendarDay } from '../lib/calendarUtils';
import TextBox from './basic/TextBox';


const Calendar: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { t } = useTranslation();
  
  const {
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
    goToDate,
  } = useCalendar();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [tempDate, setTempDate] = useState(new Date());

  const handleDatePress = (day: CalendarDay) => {
    selectDate(day.date);
  };

  const handleHeaderPress = () => {
    setTempDate(
      new Date(calendarData.monthView.year, calendarData.monthView.month, 1),
    );
    setPickerMode('date');
    setShowDatePicker(true);
  };

  const handleDatePickerChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
      // 날짜가 선택되면 자동으로 모달을 닫고 캘린더를 이동
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      goToDate(year, month, 1);
      setShowDatePicker(false);
    }
  };

  const handleDatePickerCancel = () => {
    setShowDatePicker(false);
  };

  const renderDatePickerModal = () => (
    <Modal
      visible={showDatePicker}
      transparent={true}
      animationType="slide"
      onRequestClose={handleDatePickerCancel}>
      <View style={styles.modalOverlay}>
        <DateTimePicker
          value={tempDate}
          mode={pickerMode}
          display="spinner"
          onChange={handleDatePickerChange}
        />
      </View>
    </Modal>
  );

  const renderMonthView = () => {
    return (
              <View style={[styles.container, { backgroundColor: theme.background }]}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={goToPreviousMonth}
              style={[styles.navButton]}>
              <Entypo name="chevron-left" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleHeaderPress}
              style={styles.headerTitleContainer}>
              <TextBox style={[styles.headerTitle, { color: theme.text }]}>
                {calendarData.monthView.year} {t('calendar.year')}{' '}
                {t(`calendar.months.${calendarData.monthView.month}`)}
              </TextBox>
            </TouchableOpacity>

            <TouchableOpacity onPress={goToNextMonth} style={[styles.navButton]}>
                <Entypo name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
          </View>

        {/* 요일 헤더 */}
        <View style={styles.weekHeader}>
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
            <View key={dayIndex} style={styles.dayHeader}>
              <TextBox  
                style={[
                  styles.dayHeaderText,
                  dayIndex === 0 && styles.sundayText,
                ]}>
                {t(`calendar.days.${dayIndex}`)}
              </TextBox>
            </View>
          ))}
        </View>

        {/* 날짜 그리드 */}
        {calendarData.monthView.weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.week}>
            {week.days.map((day, dayIndex) => (
              <TouchableOpacity
                key={dayIndex}
                style={[
                  styles.day,
                  { backgroundColor: theme.surface },
                  !day.isCurrentMonth && styles.otherMonthDay,
                  day.isToday && [styles.today, { borderColor: theme.primary }],
                  day.isSelected && [styles.selectedDay, { backgroundColor: theme.primary }],
                ]}
                onPress={() => handleDatePress(day)}>
                <TextBox
                  style={[
                    styles.dayText,
                    { color: theme.text },
                    !day.isCurrentMonth && styles.otherMonthDayText,
                    day.isToday && styles.todayText,
                    day.isSelected && [styles.selectedDayText, { color: theme.background }],
                    day.dayOfWeek === 0 && styles.sundayText,
                  ]}>
                  {day.day}
                </TextBox>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* 뷰 변경 버튼 */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              currentView === 'month' && styles.activeViewButton,
            ]}
            onPress={() => changeView('month')}>
            <TextBox style={styles.viewButtonText}>{t('calendar.month')}</TextBox>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewButton,
              currentView === 'week' && styles.activeViewButton,
            ]}
            onPress={() => changeView('week')}>
            <TextBox style={styles.viewButtonText}>{t('calendar.week')}</TextBox>
          </TouchableOpacity>
        </View>

        {/* 오늘 버튼 */}
        <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
          <TextBox style={styles.todayButtonText}>오늘</TextBox>
        </TouchableOpacity>

        {/* DatePicker 모달 */}
        {renderDatePickerModal()}
      </View>
    );
  };

  const renderWeekView = () => {
    const currentWeek = calendarData.weekView.find(
      week => week.weekNumber === currentWeekNumber,
    );

    if (!currentWeek) return null;

    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goToPreviousWeek} style={[styles.navButton]}>
            <Entypo name="chevron-left" size={24} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleHeaderPress}
            style={styles.headerTitleContainer}>
            <TextBox style={[styles.headerTitle, { color: theme.text }]}>
              {calendarData.monthView.year} {t('calendar.year')}{' '}
              {t(`calendar.months.${calendarData.monthView.month}`)} {currentWeekNumber}
              {t('calendar.weekNumber')}
            </TextBox>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToNextWeek} style={styles.navButton}>
            <Entypo name="chevron-right" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* 요일 헤더 */}
        <View style={styles.weekHeader}>
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
            <View key={dayIndex} style={styles.dayHeader}>
              <TextBox
                style={[
                  styles.dayHeaderText,
                  dayIndex === 0 && styles.sundayText,
                ]}>
                {t(`calendar.days.${dayIndex}`)}
              </TextBox>
            </View>
          ))}
        </View>

        {/* 주 날짜 */}
        <View style={styles.week}>
          {currentWeek.days.map((day, dayIndex) => (
            <TouchableOpacity
              key={dayIndex}
              style={[
                styles.day,
                { backgroundColor: theme.surface },
                !day.isCurrentMonth && styles.otherMonthDay,
                day.isToday && [styles.today, { borderColor: theme.primary }],
                day.isSelected && [styles.selectedDay, { backgroundColor: theme.primary }],
              ]}
              onPress={() => handleDatePress(day)}>
              <TextBox
                style={[
                  styles.dayText,
                  { color: theme.text },
                  !day.isCurrentMonth && styles.otherMonthDayText,
                  day.isToday && styles.todayText,
                  day.isSelected && [styles.selectedDayText, { color: theme.background }],
                  day.dayOfWeek === 0 && styles.sundayText,
                ]}>
                {day.day}
              </TextBox>
            </TouchableOpacity>
          ))}
        </View>

        {/* 뷰 변경 버튼 */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              currentView === 'month' && styles.activeViewButton,
            ]}
            onPress={() => changeView('month')}>
            <TextBox style={styles.viewButtonText}>{t('calendar.month')}</TextBox>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewButton,
              currentView,
              currentView === 'week' && styles.activeViewButton,
            ]}
            onPress={() => changeView('week')}>
            <TextBox style={styles.viewButtonText}>{t('calendar.week')}</TextBox>
          </TouchableOpacity>
        </View>

        {/* 오늘 버튼 */}
        <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
          <TextBox style={styles.todayButtonText}>오늘</TextBox>
        </TouchableOpacity>

        {/* DatePicker 모달 */}
        {renderDatePickerModal()}
      </View>
    );
  };

  return currentView === 'month' ? renderMonthView() : renderWeekView();
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sundayText: {
    color: '#ff4444',
  },
  week: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  day: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  otherMonthDay: {
    opacity: 0.5,
  },
  otherMonthDayText: {
    opacity: 0.7,
  },
  today: {
    borderWidth: 2,
  },
  todayText: {
    fontWeight: 'bold',
  },
  selectedDay: {
    borderWidth: 3,
  },
  selectedDayText: {
    fontWeight: 'bold',
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  viewButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  activeViewButton: {
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  todayButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#4caf50',
  },
  todayButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // DatePicker 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
