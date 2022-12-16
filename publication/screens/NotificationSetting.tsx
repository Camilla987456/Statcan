/** @format */

import React, { useEffect, useState,useRef } from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,AppState,Appearance,
  useWindowDimensions
} from "react-native";
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import {
  CommonStyles,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
  commonCardBackground,
  commonForegroundDes,
  commonSettingBackground,
} from "../normalization.js";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../settings.js";
import i18n from "../resources.js";


// This is the screen that allows the user to change the notification settings
const NotificationSettingScreen = ({ navigation }) => {
  //  This is the state of the screen
  const [theme, setTheme] = useState(global.theme);
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);

  const [name, setName] = useState("");
  const [isFrench, setIsFrench] = useState(i18n.isFrench);
  const [notifications, setNotifications] = useState([]);
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  const [inAppNotifications, setInAppNotifications] = useState(
    global.inAppNotifications
  );
  const [subjectNotificationType, setSubjectNotificationType] = useState(
    global.subjectNotificationType
  );
  const [count, setCount] = useState(0);
 const appState = useRef(AppState.currentState);const isFocused = useIsFocused();
  // This is the effect that runs when the screen is loaded
  React.useEffect(() => {
    navigation.addListener("focus", () => {
      setZoom(global.zoom);
      setBold(global.bold);
      setInAppNotifications(global.inAppNotifications);
      setName(i18n.t("manageNotifications"));
      setNotifications(global.subjectItems);
      setTheme(global.theme);
      global.indicator++;global.screen="Settings";global.SubScreen="NotificationSetting";setCount(global.indicator);
    });
  }, []);

     useFocusEffect(
          React.useCallback(() => {
            const subscriptionF = AppState.addEventListener("change", handleAppStateChangeF);console.log('subscription removed in NotificationSetting');
                return () =>{if(subscriptionF)subscriptionF.remove();console.log('subscription removed in NotificationSetting'); }
          }, [])
        );
  const handleAppStateChangeF = nextAppState => {
     console.log('NotificationSetting1 detected state change:',global.screen,'sub:',global.subScreen,'State:',appState);//if(global.screen=="Settings")navigation.navigate("Settings");
     if(global.screen=="Settings" && global.SubScreen=="NotificationSetting"){
         try{
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                global.colorScheme = Appearance.getColorScheme();global.indicator++;setCount(global.indicator);setTheme(global.theme);
                console.log('NotificationSetting2.......App has come to the foreground! scheme:',global.colorScheme,commonBackground(theme));
             }
            appState.current = nextAppState;
         }catch(err){console.log('err in NotificationSetting');return;}
     }
  }
  //  This function is used to toggle in app notifications
  const toggleInAppNotifications = () => {
    global.inAppNotifications = !global.inAppNotifications;
    AsyncStorage.setItem(
      "InAppNotifications",
      global.inAppNotifications.toString()
    );
    setInAppNotifications((previousState) => !previousState);

    global.subjectNotificationType = !global.subjectNotificationType;
    AsyncStorage.setItem(
      "SubjectNotificationType",
      global.subjectNotificationType.toString()
    );
    setSubjectNotificationType((previousState) => !previousState);
  };

  // This function is used to toggle subject switch
  const toggleSubjectType = () => {
    global.subjectNotificationType = !global.subjectNotificationType;
    AsyncStorage.setItem(
      "SubjectNotificationType",
      global.subjectNotificationType.toString()
    );
    setSubjectNotificationType((previousState) => !previousState);

    global.inAppNotifications = !global.inAppNotifications;
    AsyncStorage.setItem(
      "InAppNotifications",
      global.inAppNotifications.toString()
    );
    setInAppNotifications((previousState) => !previousState);
  };

  // This function is used to navigate back to the previous screen
  const onBackButtonClick = () => {
    global.prevNavigateRoute == ""
      ? navigation.navigate("Settings")
      : navigation.navigate("NotificationList");
    global.prevNavigateRoute = "";
  };

  return (
    <SafeAreaView style={[CommonStyles.safeArea, commonBackground(theme)]}>
      {/* This View is used to display the header of the screen. */}
      <View
        style={[
          commonBackground(theme),
          isLandscapeMode ? styles.headerLandscape : styles.header,
        ]}
      >
        <TouchableOpacity
          accessibilityRole="button"
          accessible={true}
          onPress={onBackButtonClick}
          accessibilityLabel={i18n.t("goBack")}
        >
          <Feather
            name="chevron-left"
            size={global.device == "2" ? 50 : 25}
            style={[styles.backButton, commonForegroundDes(theme)]}
          />
        </TouchableOpacity>
        <Text
          style={[
            CommonZoomStyle("medium", { zoom }),
            commonFontWeight({ bold }),
            isLandscapeMode ? styles.headerTextLandscape : styles.headerText,
            commonForegroundDes(theme),
          ]}
          accessibilityRole="header"
          accessible={true}
        >
          {name}
        </Text>
      </View>

      {/* This View is used to display the content of the screen. */}
      <ScrollView style={{ marginTop: 20 }}>
        <Text
          style={[
            CommonZoomStyle("mini", { zoom }),
            commonForegroundDes(theme),
            styles.label,
          ]}
          accessible={true}
          accessibleRole="text"
        >
          {i18n.t("notificationType")}
        </Text>
        <View style={{ marginTop: 0 }}>
          <View
            style={[
              commonSettingBackground(theme),
              {
                padding: 6,
                flexDirection: "row",
                margin: 10,
                justifyContent: "space-between",
                borderRadius: 5,
              },
            ]}
          >
            <Text
              style={[
                CommonZoomStyle("small", { zoom }),
                commonForegroundDes(theme),
                styles.label2,
              ]}
            >
              {i18n.t("inAppNotifications")}
            </Text>
            <Switch
              trackColor={{ false: "#00000026", true: "#34C759" }}
              thumbColor={bold ? "#FFFFFF" : "#FFFFFF"}
              onValueChange={toggleInAppNotifications}
              value={inAppNotifications}
              style={{
                marginTop: global.device == "2" ? "1%" : 0,
                marginBottom: global.device == "2" ? "1%" : 0,
                transform: [
                  { scaleX: Platform.OS == "android" ? 1.2 : 1.0 },
                  { scaleY: Platform.OS == "android" ? 1.2 : 1.0 },
                ],
              }}
            />
          </View>
        </View>
        <Text style={[, commonForegroundDes(theme), styles.des]}>
          {i18n.t("inAppNotificationsDes")}
        </Text>
        <Text
          style={[
            CommonZoomStyle("mini", { zoom }),
            commonForegroundDes(theme),
            styles.label,
          ]}
        >
          {i18n.t("subjectInterests")}
        </Text>
        <View style={{ marginTop: 0 }}>
          <View
            style={[
              commonSettingBackground(theme),
              {
                padding: 6,
                flexDirection: "row",
                margin: 10,
                justifyContent: "space-between",
                borderRadius: 5,
              },
            ]}
          >
            <Text
              style={[
                CommonZoomStyle("small", { zoom }),
                commonForegroundDes(theme),
                styles.label2,
              ]}
            >
              {i18n.t("subjects")}
            </Text>
            <Switch
              trackColor={{ false: "#00000026", true: "#34C759" }}
              thumbColor={bold ? "#FFFFFF" : "#FFFFFF"}
              onValueChange={toggleSubjectType}
              value={subjectNotificationType}
              style={{
                marginTop: global.device == "2" ? "1%" : 0,
                marginBottom: global.device == "2" ? "1%" : 0,
                transform: [
                  { scaleX: Platform.OS == "android" ? 1.2 : 1.0 },
                  { scaleY: Platform.OS == "android" ? 1.2 : 1.0 },
                ],
              }}
            />
          </View>
        </View>
        <Text style={[commonForegroundDes(theme), styles.des]}>
          {i18n.t("subjectsDes")}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    borderWidth: 1,
    padding: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    elevation: 0,
    borderColor: "#CCD1D7",
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  headerLandscape: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    elevation: 0,
    borderColor: "#CCD1D7",
    marginHorizontal: -50,
    width: "113%",
    paddingLeft: 30,
    paddingRight: 50,
    padding: "-20%",
    height: Platform.OS == "android" ? "16%" : "14%",
    flexDirection: "row",
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    marginRight: "15%",
  },
  headerTextLandscape: {
    flex: 1,
    textAlign: "center",
    marginRight: "15%",
    marginTop: "1.3%",
  },
  backButton: { paddingHorizontal: "4%", marginTop: 10, marginBottom: 10 },
  checkerContainer: { borderWidth: 1, marginRight: 5 },
  label: { marginLeft: 10, width: "80%", paddingTop: 2, fontWeight: "bold" },
  label2: {
    marginLeft: 0,
    width: "80%",
    paddingTop: Platform.OS == "android" ? 1 : 4,
  },
  des: {
    marginLeft: 23,
    width: "98%",
    paddingBottom: 20,
    fontSize: global.device == "2" ? 20 : 11,
    marginTop: -5,
  },
  labelContainer: {
    flexDirection: "row",
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    justifyContent: "space-between",
  },
});
export default NotificationSettingScreen;
