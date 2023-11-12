import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as vi from '../locales/vi';
import * as en from '../locales/en';
const { data: data_vi } = vi;
const { data: data_en } = en;

const resources = {
  en: {
    translation: {
      ...data_en,
    },
  },
  vi: {
    translation: {
      ...data_vi,
    },
  },
};
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'vi', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: 'vi', // nếu không tìm thấy thì sẽ là vi
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    ns: ['translation'],
    defaultNS: 'translation',
  });
export default i18n;
