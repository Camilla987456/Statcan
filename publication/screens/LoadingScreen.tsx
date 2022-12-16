/** @format */

import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import * as Localization from "expo-localization";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getNotificationsNew,
  checkConnection,
  getCategories,
  checkNotificationAvailability,
  getHighlightForAllCategories,
  getHighlightForAllCategoriesMockup,
  getSubjectListBackup,
} from "../services";
import * as Font from "expo-font";
import { DevSettings, Alert,Appearance } from "react-native";
import i18n from "../resources.js";
import "../settings.js";

export default function LoadingScreen() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  React.useEffect(() => {
    async function loadProfileAsync() {
      try {
        //Test
         Font.loadAsync({
              "NotoSans-Regular": require("../assets/Fonts/NotoSans-Regular.ttf"),
              "NotoSans-Italic": require("../assets/Fonts/NotoSans-Italic.ttf"),
            });

        SplashScreen.preventAutoHideAsync();
        global.device = await Device.getDeviceTypeAsync();
        let culture = await AsyncStorage.getItem("Culture");
        if (culture == null) {
          if (Localization.locale.includes("fr")) culture = "fr-CA";
          else culture = "en-CA";
        }
        i18n.locale = culture;
        let init = await AsyncStorage.getItem("Initial");
        if (init != null) global.init = init;
        else global.init = 0;
        let theme = await AsyncStorage.getItem("Theme");
        if (theme != null) global.theme = theme;
        else global.theme = 0;

        global.colorScheme = Appearance.getColorScheme();

        let zoom = await AsyncStorage.getItem("Zoom");
        if (zoom != null) global.zoom = parseFloat(zoom);
        else global.zoom =global.device=="2"?0.8:1;
        let bold = await AsyncStorage.getItem("Bold");
        if (bold != null) global.bold = bold.toLowerCase() == "true";
        else global.bold = true;
        console.log(
          "Loading....ends:locale:" +
            i18n.locale +
            " initial:" +
            init +
            " zoom:" +
            zoom +
            " bold:" +
            bold +
            " theme:" +
            theme +
            " device:" +
            global.device
        );
        let subjectType = await AsyncStorage.getItem("SubjectNotificationType");
        if (subjectType != null)
          global.subjectNotificationType = subjectType.toLowerCase() == "true";
        else global.subjectNotificationType = false;
        let eventType = await AsyncStorage.getItem("EventNotificationType");
        if (eventType != null)
          global.eventNotificationType = eventType.toLowerCase() == "true";
        else global.eventNotificationType = false;
        let announcementType = await AsyncStorage.getItem(
          "AnnouncementNotificationType"
        );
        if (announcementType != null)
          global.announcementNotificationType =
            announcementType.toLowerCase() == "true";
        else global.announcementNotificationType = false;
        let dataReleaseType = await AsyncStorage.getItem(
          "EventNotificationType"
        );
        if (dataReleaseType != null)
          global.dataReleaseNotificationType =
            dataReleaseType.toLowerCase() == "true";
        else global.dataReleaseNotificationType = false;
        let numOfNotification = await AsyncStorage.getItem(
          "NumberOfNotification"
        );
        if (numOfNotification != null)
          global.numberOfNotification = parseInt(numOfNotification);
        else global.numberOfNotification = 1;
        let notificationPrevDatetime = await AsyncStorage.getItem(
          "NotificationPrevDatetime"
        );
        if (notificationPrevDatetime != null)
          global.notificationPrevDatetime = new Date(notificationPrevDatetime);
        else global.notificationPrevDatetime = new Date();
        if (checkConnection()) {
          global.categories = await getCategories();
          if (global.categories.length != 0) {
            AsyncStorage.setItem(
              "CategoryBackup",
              JSON.stringify(global.categories)
            );
          }
          global.notificationCurrentDatetime = new Date();
        } else {
          let backup = await AsyncStorage.getItem("CategoryBackup");
          if (backup != null) global.categories = JSON.parse(backup);
        }
        if (global.categories.length == 0)
          global.categories = getSubjectListBackup(); //never come here

        let subjects = await AsyncStorage.getItem("Subjects");
        if (subjects != null) global.subjects = JSON.parse(subjects);
        let notificationItems = await AsyncStorage.getItem("Notifications");
        if (notificationItems != null)
          global.notificationItems = JSON.parse(notificationItems);
        console.log(
          "saved Notification list:",
          global.notificationItems.length
        );

        if (global.categories.length > 0) {
          let subjectItems = [];
          for (let i = 0; i < global.categories.length; i++) {
            let value = false;
            let found = global.subjects.find(
              (item) => item.key === global.categories[i].key
            );
            if (found) value = true;
            let value1 = false;
            //let found1=global.notifications.find((item) => item.key === global.categories[i].key);if(found1)value1=true;
            subjectItems.push({
              key: global.categories[i].key,
              eng: global.categories[i].eng,
              fre: global.categories[i].fre,
              value: value,
              value1: value1,
            });
          }
          global.subjectItems = subjectItems;
        }

        let inAppNotifications = await AsyncStorage.getItem(
          "InAppNotifications"
        );
        if (inAppNotifications != null)
          global.inAppNotifications =
            inAppNotifications.toLowerCase() == "true";
        else global.inAppNotifications = true;
        let pushNotifications = await AsyncStorage.getItem("PushNotifications");
        if (pushNotifications != null)
          global.pushNotifications = pushNotifications.toLowerCase() == "true";
        else global.pushNotifications = true;
        let subjectNotificationType = await AsyncStorage.getItem(
          "SubjectNotificationType"
        );
        if (subjectNotificationType != null)
          global.subjectNotificationType =
            subjectNotificationType.toLowerCase() == "true";
        else global.subjectNotificationType = true;

        let readAll = await AsyncStorage.getItem("ReadAll");
        if (readAll != null)
          global.notificationReadAll = readAll.toLowerCase() == "true";
        else global.notificationReadAll = true;

        //Delete it after new flowwing api
        // global.mockup?getHighlightForAllCategoriesMockup(i18n.locale,new Date(),global.notificationPrevDatetime):getHighlightForAllCategories(i18n.locale,new Date(),global.notificationPrevDatetime);

        let recentSearchesE = await AsyncStorage.getItem("RecentSearchesE");
        if (recentSearchesE != null)
          global.recentSearchesE = JSON.parse(recentSearchesE);
        let recentSearchesF = await AsyncStorage.getItem("RecentSearchesF");
        if (recentSearchesF != null)
          global.recentSearchesF = JSON.parse(recentSearchesF);

        /* let savedItemsF = await AsyncStorage.getItem("SavedItemsF");
        if (savedItemsF != null) global.savedItemsF = JSON.parse(savedItemsF);
        let savedItemsE = await AsyncStorage.getItem("SavedItemsE");
        if (savedItemsE != null) global.savedItemsE = JSON.parse(savedItemsE); */

        let savedItems = await AsyncStorage.getItem("SavedItems");
        if (savedItems != null) global.savedItems = JSON.parse(savedItems);
        console.log('Saved items:',global.savedItems);
        // Test only Artificially delay for two seconds to simulate a slow loading
        // await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }
    loadProfileAsync();
  }, []);
  return isLoadingComplete;
}
