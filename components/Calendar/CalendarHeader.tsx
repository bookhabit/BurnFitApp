import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import TextBox from "../basic/TextBox";

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrevious: () => void;
  onNext: () => void;
  onHeaderPress: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  year,
  month,
  onPrevious,
  onNext,
  onHeaderPress,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPrevious} style={styles.navButton}>
        <Entypo name="chevron-left" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onHeaderPress}
        style={styles.headerTitleContainer}
      >
        <TextBox variant="title3">
          {year} {t("calendar.year")} {t(`calendar.months.${month}`)}
        </TextBox>
      </TouchableOpacity>

      <TouchableOpacity onPress={onNext} style={styles.navButton}>
        <Entypo name="chevron-right" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitleContainer: {
    alignItems: "center",
    flex: 1,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
