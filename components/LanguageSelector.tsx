import { useTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { useLanguage } from "../contexts/LanguageContext";
import TextBox from "./basic/TextBox";

const LanguageSelector: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const { theme } = useTheme();

  const languages = [
    { code: "ko", name: t("languages.korean") },
    { code: "en", name: t("languages.english") },
    { code: "ja", name: t("languages.japanese") },
    { code: "vi", name: t("languages.vietnamese") },
  ];

  const handleLanguageSelect = (languageCode: string) => {
    changeLanguage(languageCode as "ko" | "en" | "ja" | "vi");
    setIsVisible(false);
  };

  const getCurrentLanguageName = () => {
    const lang = languages.find((l) => l.code === currentLanguage);
    return lang ? lang.name : t("languages.korean");
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.selector,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
        onPress={() => setIsVisible(true)}
      >
        <TextBox
          variant="body2"
          style={[styles.selectorText, { color: theme.text }]}
        >
          {t("myPage.language")}: {getCurrentLanguageName()}
        </TextBox>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.background, borderColor: theme.border },
            ]}
          >
            <TextBox
              variant="title4"
              style={[styles.modalTitle, { color: theme.text }]}
            >
              {t("myPage.language")}
            </TextBox>

            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                  currentLanguage === language.code && {
                    backgroundColor: theme.primary,
                  },
                ]}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <TextBox
                  variant="body2"
                  style={[
                    styles.languageText,
                    {
                      color:
                        currentLanguage === language.code
                          ? theme.background
                          : theme.text,
                    },
                  ]}
                >
                  {language.name}
                </TextBox>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: theme.surface }]}
              onPress={() => setIsVisible(false)}
            >
              <TextBox
                variant="body2"
                style={[styles.cancelButtonText, { color: theme.text }]}
              >
                {t("common.cancel")}
              </TextBox>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 10,
  },
  selectorText: {
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  languageOption: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 5,
  },
  languageText: {
    textAlign: "center",
  },
  cancelButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  cancelButtonText: {
    textAlign: "center",
  },
});

export default LanguageSelector;
