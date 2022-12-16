import i18n from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
i18n.translations = {
  en:require('./locales/en.json'),
  fr:require('./locales/fr.json')
};
i18n.locale ="en-CA";   //Localization.locale;     //
i18n.fallbacks = true;
i18n.isOSFrench=Localization.locale=='fr-CA';
i18n.toogle=()=>{
   if(i18n.locale=='en-CA')
     {i18n.locale='fr-CA';AsyncStorage.setItem('Culture', 'fr-CA');}
   else {i18n.locale='en-CA';AsyncStorage.setItem('Culture', 'en-CA');}
}
i18n.isFrench=()=>{let v=false;if(i18n.locale=='fr-CA')v=true;return v;}
export default i18n;