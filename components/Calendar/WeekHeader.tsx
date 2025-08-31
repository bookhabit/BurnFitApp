import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import TextBox from "../basic/TextBox";

export const WeekHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.weekHeader}>
      {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
        <View key={dayIndex} style={styles.dayHeader}>
          <TextBox
            variant="body4"
            style={dayIndex === 0 ? styles.sundayText : undefined}
          >
            {t(`calendar.days.${dayIndex}`)}
          </TextBox>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  weekHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  dayHeader: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  sundayText: {
    color: "#ff4444",
  },
});
