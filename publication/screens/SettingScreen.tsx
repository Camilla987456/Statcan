/** @format */

// Tab View inside Navigation Drawer
// https://aboutreact.com/tab-view-inside-navigation-drawer-sidebar-with-react-navigation/

import React, { useEffect, useState, useRef } from "react";
import {
  Platform,
  Share,
  Image,
  Button,
  View,
  Text,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
  StatusBar,
  AppState,
  Appearance,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  CommonStyles,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
  commonForegroundDes,
  commonFrameBackground,
  commonBorder,
  commonSettingBackground,
  commonCardBackground,
  themeLiteral,
} from "../normalization.js";
import { arrayGroupBy } from "../services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";
import Slider from "@react-native-community/slider";
import { Feather } from "@expo/vector-icons";
import "../settings.js";
import { expo } from "../app.json";
import i18n from "../resources.js";
import { Divider } from "react-native-elements";
import RadioButton from "expo-radio-button";

import Constants from "expo-constants";


const SettingScreen = ({ navigation }) => {
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [theme, setTheme] = useState(global.theme);
  const [isEnglish, setIsEnglish] = useState(true);
  const [name, setName] = useState(i18n.t("settings"));
  const [datefilter, setDatefilter] = useState("option 1");
  const [locationfilter, setLocationfilter] = useState("option 1");
  const [sorting, setSorting] = useState("option 1");
  const [count, setCount] = useState(0);
   const { width, height } = useWindowDimensions();
   const isLandscapeMode = width > height ? true : false;

  let index = themeLiteral() == "light" ? 0 : 1;
  const [statusBarStyle, setStatusBarStyle] = useState(global.STYLES[index]);
  const [statusBarColor, setStatusBarColor] = useState(
    Platform.OS === "ios" ? global.COLORSIOS[index] : global.COLORS[index]
  );
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();
  React.useEffect(
    () =>
      navigation.addListener("focus", () => {
        global.indicator++;
        global.screen = "Settings";
        global.SubScreen = "Settings";
        setZoom(global.zoom);
        setBold(global.bold);
        setCount(global.indicator);
        global.navigationIndicator = 0;
        setName(i18n.t("settings"));
        setTheme(global.theme);

        index = themeLiteral() == "light" ? 0 : 1;
        setStatusBarStyle(global.STYLES[index]);
        setStatusBarColor(
          Platform.OS === "ios" ? global.COLORSIOS[index] : global.COLORS[index]
        );
      }),

    []
  );

  useFocusEffect(
    React.useCallback(() => {
      global.SubScreen = "Settings";
      const subscriptionS = AppState.addEventListener(
        "change",
        handleAppStateChangeS
      );
      console.log("subscription removed in Settings");
      return () => {
        if (subscriptionS) subscriptionS.remove();
        console.log("subscription removed in Settings");
      };
    }, [])
  );
  const handleAppStateChangeS = (nextAppState) => {
    console.log(
      "SettingScreen1 detected state change:",
      global.screen,
      "sub:",
      global.subScreen,
      "State:",
      appState
    ); //if(global.screen=="Settings")navigation.navigate("Settings");
    if (
      (global.screen == "Settings" && global.SubScreen == "Settings") ||
      global.screen == "SettingStack"
    ) {
      try {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          global.colorScheme = Appearance.getColorScheme();
          global.indicator++;
          setCount(global.indicator);
          setTheme(global.theme);
          console.log(
            "SettingScreen2.......App has come to the foreground! scheme:",
            global.colorScheme,
            commonBackground(theme)
          );
          index = themeLiteral() == "light" ? 0 : 1;
          setStatusBarStyle(global.STYLES[index]);
          setStatusBarColor(
            Platform.OS === "ios"
              ? global.COLORSIOS[index]
              : global.COLORS[index]
          );
        }
        appState.current = nextAppState;
      } catch (err) {
        console.log("err in Settings");
        return;
      }
    }
  };

  const toggleSwitch = () => {
    setIsEnglish((previousState) => !previousState);
    // i18n.locale.isEnglish=!resources.isEnglish;
    i18n.toogle();
    setName(i18n.t("settings"));
    navigation.navigate("SettingScreen");
  };
  const sliderValueChange = (v) => {
    // console.log('slider:'+v);
  };
  const sliderCompleted = (v) => {
    global.zoom = v;
    setZoom(v);
    console.log("Completed:" + JSON.stringify(CommonStyles.xlargeFont));
    setName(i18n.t("settings"));
  };
  const sliderStart = (v) => {
    console.log("slider start:" + v);
  };
  const languageClick = () => {
    navigation.navigate("LanguageSetting");
  };
  const zoomClick = () => {
    navigation.navigate("ZoomSetting");
  };
  const clearHistory = () =>
    Alert.alert(
      i18n.t("clearSearchHistory"),
      i18n.t("clearSearchHistoryContent"),
      [
        {
          text: i18n.t("cancel"),
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: i18n.t("clear"),
          onPress: () => {
            i18n.isFrench()
              ? (global.recentSearchesF = [])
              : (global.recentSearchesE = []);
            console.log("OK Pressed");
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );

  const onShare = async () => {
    let text = ""; // i18n.t("shareappMsg");
    Platform.OS === "android"
      ? (text = text.concat(i18n.t("playstoreLink")))
      : (text = text.concat("\n", i18n.t("appstoreLink")));
    try {
      const result = await Share.share(
        {
          title: i18n.t("shareappTitle"),
          message: text,
        },
        {
          // Android only:
          // dialogTitle: i18n.t("dialogTitle"),
          // iOS only:
          subject: i18n.t("shareappTitle"),
          excludedActivityTypes: [],
        }
      );
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error);
    }
  };

//  const [fontLoaded, setFontLoaded] = useState(false);
  const onTestNotification = () => {
    let str = "";
    let list = arrayGroupBy(global.notificationItems, "subject_id");
    for (const [key, value] of Object.entries(list)) {
      str += `subject_id:${key}(${value.length}):\r\n`;
      value.forEach(function (x) {
        str += `\t\t\tid:${x.id}\r\n\t\t\ttitle:${x.title_en.substring(
          0,
          25
        )}...\r\n\t\t\tdate:${x.published_date.substring(0, 19)}\r\n`;
      });
    }
    alert(str);
  };


  return (
    <>
      {Platform.OS == "ios" && (
        <View
          style={{
            height: Constants.statusBarHeight,
            backgroundColor: statusBarColor,
          }}
        >
          <StatusBar translucent barStyle={statusBarStyle} />
        </View>
      )}
      <SafeAreaView style={[CommonStyles.safeArea, commonBackground(theme)]}>
        {Platform.OS == "android" && (
          <StatusBar
            barStyle={statusBarStyle}
            backgroundColor={statusBarColor}
          />
        )}
        <View
          style={[
            commonBackground(theme),
            isLandscapeMode
              ? styles.tabHeaderContainerLandscapeIpad
              : CommonStyles.tabHeaderContainer,
            ,
          ]}
        >
          <Text
            style={[
              isLandscapeMode
                ? CommonZoomStyle("small", { zoom })
                : CommonZoomStyle("medium", { zoom }),
              commonFontWeight({ bold }),
              commonForegroundDes(theme),
              isLandscapeMode
                ? CommonStyles.tabHeaderTitleLandscape
                : CommonStyles.tabHeaderTitle,
            ]}
            accessibilityRole="header"
            accessible={true}
          >
            {name}
          </Text>
        </View>
        <ScrollView style={styles.scrollViewContainer}>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
              styles.groupTitle,
            ]}
            accessibilityRole="header"
            accessible={true}
          >
            {i18n.t("general").toUpperCase()}
          </Text>
          <View
            style={[
              styles.groupContainer,
              commonSettingBackground(theme),
              commonBorder(theme),
            ]}
          >
            <TouchableOpacity
              style={styles.touchableBtn}
              accessibilityRole="button"
              accessible={true}
              onPress={languageClick}
            >
              <View style={styles.touchableBtnContainer}>
                <Text
                  style={[
                    CommonZoomStyle("small", { zoom }),
                    commonForegroundDes(theme),
                    styles.label,
                  ]}
                >
                  {i18n.t("language")}
                </Text>
                <Feather
                  name="chevron-right"
                  size={global.device == "2" ? 50 : 18}
                  style={[styles.touchableIcon, commonForegroundDes(theme)]}
                />
              </View>

              <Divider />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchableBtn}
              accessibilityRole="button"
              accessible={true}
              onPress={() => navigation.navigate("StyleSetting")}
            >
              <View style={styles.touchableBtnContainer}>
                <Text
                  style={[
                    CommonZoomStyle("small", { zoom }),
                    commonForegroundDes(theme),
                    styles.label,
                  ]}
                >
                  {i18n.t("textSize")}
                </Text>
                <Feather
                  name="chevron-right"
                  size={global.device == "2" ? 50 : 18}
                  style={[styles.touchableIcon, commonForegroundDes(theme)]}
                />
              </View>

              <Divider />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchableBtn}
              accessibilityRole="button"
              accessible={true}
              onPress={() => navigation.navigate("ThemeSetting")}
            >
              <View style={[styles.touchableBtnContainer]}>
                <Text
                  style={[
                    CommonZoomStyle("small", { zoom }),
                    commonForegroundDes(theme),
                    styles.label,
                  ]}
                >
                  {i18n.t("colorTheme")}
                </Text>
                <Feather
                  name="chevron-right"
                  size={global.device == "2" ? 50 : 18}
                  style={[styles.touchableIcon, commonForegroundDes(theme)]}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
              styles.groupTitle,
            ]}
            accessibilityRole="header"
            accessible={true}
          >
            {i18n.t("preferences").toUpperCase()}
          </Text>
          <View
            style={[
              styles.groupContainer,
              commonSettingBackground(theme),
              commonBorder(theme),
            ]}
          >
            <TouchableOpacity
              style={styles.touchableBtn}
              accessibilityRole="button"
              accessible={true}
              onPress={() => navigation.navigate("NotificationSetting")}
            >
              <View style={styles.touchableBtnContainer}>
                <Text
                  style={[
                    CommonZoomStyle("small", { zoom }),
                    commonForegroundDes(theme),
                    styles.label,
                  ]}
                >
                  {i18n.t("manageNotifications")}
                </Text>
                <Feather
                  name="chevron-right"
                  size={global.device == "2" ? 50 : 18}
                  style={[styles.touchableIcon, commonForegroundDes(theme)]}
                />
              </View>

              <Divider  />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchableBtn}
              accessibilityRole="button"
              accessible={true}
              onPress={() => navigation.navigate("SubjectsSetting")}
            >
              <View style={styles.touchableBtnContainer}>
                <Text
                  style={[
                    CommonZoomStyle("small", { zoom }),
                    commonForegroundDes(theme),
                    styles.label,
                  ]}
                >
                  {i18n.t("manageSubjectFollowing")}
                </Text>
                <Feather
                  name="chevron-right"
                  size={global.device == "2" ? 50 : 18}
                  style={[styles.touchableIcon, commonForegroundDes(theme)]}
                />
              </View>
              <Divider />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchableBtn}
              accessibilityRole="button"
              accessible={true}
              onPress={clearHistory}
            >
              <View style={styles.touchableBtnContainer}>
                <Text
                  style={[
                    CommonZoomStyle("small", { zoom }),
                    commonForegroundDes(theme),
                    styles.label,
                  ]}
                >
                  {i18n.t("clearSearchHistory")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
              styles.groupTitle,
            ]}
            accessibilityRole="header"
            accessible={true}
          >
            {i18n.t("support").toUpperCase()}
          </Text>
          <View
            style={[
              styles.groupContainer,
              commonSettingBackground(theme),
              commonBorder(theme),
            ]}
          >
            <TouchableOpacity
              style={styles.touchableBtn}
              accessibilityRole="button"
              accessible={true}
              onPress={() => {
                global.prevNavigateRoute = "Settings";
                //   navigation.navigate("ContactUs", { item: null });
                navigation.navigate("BrowserSetting", {
                  url: i18n.t("contactUsLink"),
                  title: "contactus",
                });
              }}
            >
              <View style={styles.touchableBtnContainer}>
                <Text
                  style={[
                    CommonZoomStyle("small", { zoom }),
                    commonForegroundDes(theme),
                    styles.label,
                  ]}
                >
                  {i18n.t("submitQuestion")}
                </Text>
                <Feather
                  name="chevron-right"
                  size={global.device == "2" ? 50 : 18}
                  style={[styles.touchableIcon, commonForegroundDes(theme)]}
                />
              </View>
              <Divider />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchableBtn}
              accessibilityRole="button"
              accessible={true}
              onPress={() => navigation.navigate("HelpSetting")}
            >
              <View style={styles.touchableBtnContainer}>
                <Text
                  style={[
                    CommonZoomStyle("small", { zoom }),
                    commonForegroundDes(theme),
                    styles.label,
                  ]}
                >
                  {i18n.t("helpAndFAQs")}
                </Text>
                <Feather
                  name="chevron-right"
                  size={global.device == "2" ? 50 : 18}
                  style={[styles.touchableIcon, commonForegroundDes(theme)]}
                />
              </View>
              <Divider />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchableBtn}
              accessibilityRole="button"
              accessible={true}
              onPress={() => navigation.navigate("SocialMediaSetting")}
            >
              <View style={styles.touchableBtnContainer}>
                <Text
                  style={[
                    CommonZoomStyle("small", { zoom }),
                    commonForegroundDes(theme),
                    styles.label,
                  ]}
                >
                  {i18n.t("socialmedia")}
                </Text>
                <Feather
                  name="chevron-right"
                  size={global.device == "2" ? 50 : 18}
                  style={[styles.touchableIcon, commonForegroundDes(theme)]}
                />
              </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity
              style={styles.touchableBtn}
              accessibilityRole="button"
              accessible={true}
              onPress={onShare}
            >
              <View style={styles.touchableBtnContainer}>
                <Text
                  style={[
                    CommonZoomStyle("small", { zoom }),
                    commonForegroundDes(theme),
                    styles.label,
                  ]}
                >
                  {i18n.t("shareApp")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text
            style={[
              CommonZoomStyle("mini", { zoom }),
              commonForegroundDes(theme),
              styles.groupTitle,
            ]}
            accessibilityRole="header"
            accessible={true}
          >
            {i18n.t("moreInformation").toUpperCase()}
          </Text>
          <View
            style={[
              styles.groupContainer,
              commonSettingBackground(theme),
              commonBorder(theme),
            ]}
          >
            <TouchableOpacity
              style={styles.touchableBtn}
              accessibilityRole="button"
              accessible={true}
              onPress={() =>
                navigation.navigate("PrivacySetting", {
                  url: i18n.t("privacyPolicyLink"),
                  title: "privacyPolicy",
                })
              }
            >
              <View style={styles.touchableBtnContainer}>
                <Text
                  style={[
                    CommonZoomStyle("small", { zoom }),
                    commonForegroundDes(theme),
                    styles.label,
                  ]}
                >
                  {i18n.t("privacyPolicy")}
                </Text>
                <Feather
                  name="chevron-right"
                  size={global.device == "2" ? 50 : 18}
                  style={[styles.touchableIcon, commonForegroundDes(theme)]}
                />
              </View>
              <Divider />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchableBtn}
              accessibilityRole="button"
              accessible={true}
              onPress={() => navigation.navigate("TermConditionSetting")}
            >
              <View style={styles.touchableBtnContainer}>
                <Text
                  style={[
                    CommonZoomStyle("small", { zoom }),
                    commonForegroundDes(theme),
                    styles.label,
                  ]}
                >
                  {i18n.t("termAndCondition")}
                </Text>
                <Feather
                  name="chevron-right"
                  size={global.device == "2" ? 50 : 18}
                  style={[styles.touchableIcon, commonForegroundDes(theme)]}
                />
              </View>
              <Divider />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchableBtn}
              accessibilityRole="none"
              accessible={true}
            >
              <View style={styles.touchableBtnContainer}>
                <Text
                  style={[
                    CommonZoomStyle("small", { zoom }),
                    commonForegroundDes(theme),
                    styles.label,
                  ]}
                >
                  {i18n.t("aboutApp")}
                </Text>
                <View>
                  <Text
                    style={[
                      CommonZoomStyle("mini", { zoom }),
                      commonForegroundDes(theme),
                      ,
                      isLandscapeMode
                        ? styles.appVersionLandscape
                        : styles.appVersion,
                    ]}
                  >
                    {expo.version}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
         
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                CommonZoomStyle("mini", { zoom }),
                commonForegroundDes(theme),
                styles.copyright,
              ]}
            >
              {i18n.t("copyRight")}
            </Text>
            <Text
              style={[
                CommonZoomStyle("mini", { zoom }),
                commonForegroundDes(theme),
                styles.rightsreserved,
              ]}
            >
              {i18n.t("allrightsreserved")}
            </Text>
          </View>
          <View>
            {themeLiteral() == "light" ? (
              <Image
                style={styles.image}
                source={require("../assets/Canada_wordmark_logo.png")}
              />
            ) : (
              <Image
                style={styles.image}
                source={require("../assets/darkmodewordmark.png")}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  scrollViewContainer: { flex: 1, padding: 5, marginRight: 5, marginLeft: 5 },
  groupTitle: {
    textAlign: "left",
    marginTop: 5,
    fontWeight: "bold",
    paddingTop: 10,
    paddingVertical: "1%",
  },
  groupContainer: {
    backgroundColor: "#1A2636",
    borderWidth: 0,
    borderRadius: 10,
    padding: 5,
    paddingBottom: 0,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1, // IOS
    shadowRadius: 4, //IOS
    shadowColor: "#00000029", // IOS
    elevation: 2, // Android
  },
  touchableBtn: {
    marginBottom: "0%",
    marginVertical: "-3%",
  },
  touchableBtnContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: -2,
  },
  touchableIcon: { marginLeft: 2, marginTop: "6%" },
  label: {
    width: "80%",
    marginBottom: "2%",
    marginLeft: "3%",
    marginTop: "4%",
    paddingVertical: "1%",
  },
  copyright: {
    justifyContent: "center",
    paddingTop: "2%",
  },
  rightsreserved: {
    justifyContent: "center",
    paddingTop: "1%",
  },
  appVersion: {
    justifyContent: "flex-end",
    paddingTop:
      global.device == "2"
        ? Platform.OS == "android"
          ? "2%"
          : "3%"
        : Platform.OS == "android"
        ? "0%"
        : "3%",
    marginTop: Platform.OS == "android" ? "65%" : "45%",
    marginRight: Platform.OS == "android" ? 7 : 7,
  },
  image: {
    resizeMode: "contain",
    width: "25%",
    height: "4%",
    paddingVertical: "6%",
    marginHorizontal: Platform.OS == "android" ? "37%" : "36%",
    marginTop: "1%",
  },
  tabHeaderContainerLandscapeIpad: {
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
    height: Platform.OS == "android" ? "20%" : "2%",
    paddingTop: "5%",
  },
  appVersionLandscape: {
    justifyContent: "flex-end",
    paddingTop:
      global.device == "2"
        ? Platform.OS == "android"
          ? "2%"
          : "3%"
        : Platform.OS == "android"
        ? "3%"
        : "3%",
    marginTop: Platform.OS == "android" ? "65%" : "45%",
    marginRight: Platform.OS == "android" ? 7 : 7,
  },
});
export default SettingScreen;
