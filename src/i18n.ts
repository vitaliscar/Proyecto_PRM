import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import esVE from "./locales/es-VE.json";

i18n.use(initReactI18next).init({
  resources: { "es-VE": { translation: esVE } },
  lng: "es-VE",
  fallbackLng: "es-VE",
  interpolation: { escapeValue: false },
});

export default i18n;
