/** @format */

import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  CheckBox,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
  Dimensions,
  Platform,
  AppState,
  Appearance,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../settings.js";
import i18n from "../resources.js";
import { adjustedDate } from "./AdjustedDate.tsx";
import { convertDateCategory } from "../services";
import {
  CommonStyles,
  themeLiteral,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackgroundColor,
  commonBackground,
  commonForeground,
  commonFrameBackground,
  commonCardBackground,
  commonForegroundDes,
} from "../normalization.js";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";

const banner = require("../assets/img_canadamdpi.png");
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const NotificationListScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  const [menu, setMenu] = useState(false);
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [theme, setTheme] = useState(global.theme);
  const [fetchDone, setFetchDone] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(i18n.t("markAllMsg"));
  const [afterGet, setAfterGet] = useState(global.afterGet);
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    navigation.addListener("focus", () => {
      console.log("noti list get focus");
      setZoom(global.zoom);
      setBold(global.bold);
      setMenu(false);
      global.indicator++;
      global.screen = "NotificationList";
      setName(i18n.t("notifications"));
      setTheme(global.theme);
      global.notificationReadAll = true; //Github uat#27
      AsyncStorage.setItem("ReadAll", "true");
      //   setReadFlag(global.readFlag);
      setData(global.notificationItems);
      setFetchDone(true);
    });
    navigation.addListener("blur", () => setFetchDone(false));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const subscriptionFl = AppState.addEventListener(
        "change",
        handleAppStateChangeFl
      );
      console.log("subscription removed in NotificationList");
      return () => {
        if (subscriptionFl) subscriptionFl.remove();
        console.log("subscription removed in NotificationList");
      };
    }, [])
  );
  const handleAppStateChangeFl = (nextAppState) => {
    console.log(
      "NotificationList detected state change come here:",
      global.screen,
      "subScreen:",
      global.subscreen,
      "State:",
      appState
    );
    if (global.screen.includes("NotificationList")) {
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
            "NotificationList.......App has come to the foreground! scheme:",
            global.colorScheme,
            count,
            commonBackground(theme)
          );
        }
        appState.current = nextAppState;
      } catch (err) {
        console.log("err in NotificationList");
        return;
      }
    }
  };
  const markReadAll = () => {
    setToast(true);
    setMenu(false);
    /*   global.readFlag = [...Array(data.length)].fill(true); // for(var i=0;i<global.readFlag.length;i++){global.readFlag[i]=true;}
    setReadFlag([...global.readFlag]); */
    global.notificationItems.forEach(function (x) {
      x.readFlag = true;
    });
    AsyncStorage.setItem(
      "Notifications",
      JSON.stringify(global.notificationItems)
    );
    setData(global.notificationItems);

    global.notificationReadAll = true;
    setTimeout(() => {
      setToast(false);
    }, 3500);
  };
  const goNotificationSetting = () => {
    setMenu(false);
    global.prevNavigateRoute = "NotificationList";
    navigation.navigate("SettingScreen", { screen: "NotificationSetting" });
  };
  const saveReadFlag = (id) => {
    let found = global.notificationItems.find((x) => x.id == id);
    if (found) found.readFlag = true;
    setData([]);
    AsyncStorage.setItem(
      "Notifications",
      JSON.stringify(global.notificationItems)
    );
  };
  return (
    <SafeAreaView style={[CommonStyles.safeArea, commonBackground(theme)]}>
      <View
        style={[
          commonBackground(theme),
          isLandscapeMode
            ? styles.headerLandscapeStyle
            : styles.headerPortraitStyle,
        ]}
      >
        <TouchableOpacity
          style={{ minWidth: 44, minHeight: 44 }}
          accessibilityRole="button"
          accessible={true}
          onPress={() => navigation.navigate("Main",{screen: 'HomeTab'})}
          accessibilityLabel={i18n.t("goBack")}
        >
          <Feather
            name="chevron-left"
            size={global.device == "2" ? 50 : 25}
            style={[
              {
                marginTop: 10,
                marginBottom: 10,
                paddingLeft: isLandscapeMode
                  ? global.device == "2"
                    ? "2%"
                    : '3%'
                  : 0,
              },
              commonForegroundDes(theme),
            ]}
          />
        </TouchableOpacity>
        <Text
          style={[
            CommonZoomStyle("medium", { zoom }),
            commonFontWeight({ bold }),
            { textAlign: "center", marginLeft: 10 },
            commonForegroundDes(theme),
          ]}
          accessibilityRole="header"
          accessible={true}
        >
          {name}
        </Text>
        {data.length != 0 ? (
          <TouchableOpacity
            style={{ marginRight: 5 }}
            accessibilityRole="button"
            accessible={true}
            onPress={() => setMenu(!menu)}
            accessibilityLabel={i18n.t("dropdownMenu")}
          >
            <Feather
              name="more-horizontal"
              size={global.device == "2" ? 50 : 25}
              style={[
                { marginTop: 10, marginBottom: 10 , marginLeft:isLandscapeMode?global.device=='2'?'10%':0:0},
                commonForegroundDes(theme),
              ]}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} accessible={false}>
            <Text accessible={false}></Text>
          </View>
        )}
      </View>
      {menu && data.length != 0 && (
        <View
          style={[
            {
              borderRadius: 8,
              position: "absolute",
              top:
                Platform.OS == "android"
                  ? "9%"
                  : global.device == "2"
                  ? "12%"
                  : "15%",
              right: "5%",
              left: "30%",
              shadowOffset: {
                width: 3,
                height: 3,
              },
              shadowOpacity: 1, // IOS
              shadowRadius: 3, //IOS
              shadowColor: "#92A8C14D", // IOS
              zIndex: 200,
              borderWidth: 1,
              elevation: 10, // Android,
              borderColor: "#92A8C14D",
            },
            commonCardBackground(theme),
          ]}
        >
          <TouchableOpacity
            style={{ marginRight: 0, borderRadius: 5 }}
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel={i18n.t("markAllAsRead")}
            onPress={markReadAll}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 13,
                paddingTop: 10,
              }}
            >
              <Text
                style={[
                  global.device == "2"
                    ? CommonZoomStyle("mini", { zoom })
                    : CommonZoomStyle("small", { zoom }),

                  {
                    textAlign: "center",
                    marginLeft: 12,
                    marginRight: 8,
                    paddingTop: 4,
                  },
                  commonForegroundDes(theme),
                ]}
              >
                {i18n.t("markAllAsRead")}
              </Text>
              <Feather
                name="check"
                size={global.device == "2" ? 50 : 18}
                style={[
                  { marginTop: 5, marginBottom: 10, marginLeft: 16 },
                  commonForeground(theme),
                ]}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              borderWidth: global.device == "2" ? 2 : 1,
              marginLeft: 25,
              borderColor: "#CCD1D7",
            }}
          ></View>
          <TouchableOpacity
            style={{ marginRight: 0, borderRadius: 5 }}
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel={i18n.t("manageNotifications")}
            onPress={goNotificationSetting}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 13,
                paddingTop: 10,
              }}
            >
              <Text
                style={[
                  global.device == "2"
                    ? CommonZoomStyle("mini", { zoom })
                    : CommonZoomStyle("small", { zoom }),

                  {
                    textAlign: "center",
                    marginLeft: 12,
                    marginRight: 8,
                    paddingTop: Platform.OS === "android" ? 2 : 3,
                  },
                  commonForegroundDes(theme),
                ]}
              >
                {i18n.t("manageNotifications")}
              </Text>
              <Ionicons
                name="settings"
                size={global.device == "2" ? 50 : 18}
                style={[
                  { marginTop: 5, marginBottom: 10, marginLeft: 16 },
                  commonForeground(theme),
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
      )}
      {data.length == 0 && fetchDone ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 10,
            marginTop: global.device == "2" ? "8%" : 15,
          }}
        >
          <Text
            style={[
              isLandscapeMode ? styles.titleLandscape : styles.title,
              CommonZoomStyle("small", { zoom }),
              commonForeground(theme),
            ]}
          >
            {i18n.t("notificationMsg")}
          </Text>
          <Text
            style={[
              styles.title,
              CommonZoomStyle("mini", { zoom }),
              commonForeground(theme),
              { fontStyle: "italic" },
            ]}
          >
            {i18n.t("notificationNote")}
          </Text>
          <Image
            style={isLandscapeMode ? styles.imagelandscape : styles.image}
            source={require("../assets/Push-notification.png")}
          />
        </View>
      ) : (
        <FlatList
          style={{
            width: isLandscapeMode? global.device=='2'?"102%":"101%":"100%",
          }}
          data={data}
          renderItem={({ item, index }) => (
            <View
              id={index}
              style={[
                commonCardBackground(theme),
                CommonStyles.cardContainer,
                { marginHorizontal: "3%" },
              ]}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  global.prevNavigateRoute = "NotificationList";
                  item.readFlag = true;
                  saveReadFlag(item.id);
                  global.articleId = item.id;
                  navigation.navigate("DisplayArticle", { item: item });
                }}
              >
                <View style={CommonStyles.cardViewSmall}>
                  <View style={{ width: global.device == "2" ? 20 : 14 }}>
                    {!item.readFlag && (
                      <Ionicons
                        name="ellipse-sharp"
                        size={global.device == "2" ? 20 : 14}
                        style={{ color: "red", fontWeight: "bold" }}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      padding: 10,
                      paddingRight: 35,
                      width:
                        global.device == "2"
                          ? windowWidth - 20
                          : windowWidth - 14,
                    }}
                  >
                    <Text
                      style={[
                        CommonZoomStyle("small", { zoom }),
                        commonForeground(theme),
                      ]}
                      numberOfLines={4}
                      ellipsizeMode="tail"
                    >
                      {i18n.isFrench() ? item.title_fr : item.title_en}
                    </Text>
                    {adjustedDate(
                      convertDateCategory(item.published_date),
                      zoom,
                      theme,
                      false
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        />
      )}

      {toast && (
        <View
          style={[
            {
              alignSelf: "center",
              borderRadius: global.device == "2" ? 40 : 17,
              width: i18n.isFrench() ? "95%" : "90%",
              height:isLandscapeMode?global.device=='2'?"7%": "10%":
                global.device == "2" ? "6%" : i18n.isFrench() ? "6%" : "5.5%",
              position: "absolute",
              marginLeft: 25,
              marginRight: 25,
              top:isLandscapeMode?global.device=='2'?'12%':'22%':
                global.device == "2"
                  ? "9%"
                  : Platform.OS == "android"
                  ? "9%"
                  : "15%",
              zIndex: 20,
              backgroundColor:
                themeLiteral() == "light" ? "#335075" : "#17B8FC",
            },
          ]}
        >
          <Text
            style={[
              commonFontWeight({ bold }),
              commonForeground(theme),
              {
                color: themeLiteral() == "light" ? "white" : "#FFFFFF",
                fontFamily: "NotoSans-Regular",
                textAlign: "center",
                paddingVertical:isLandscapeMode ? 7:
                  global.device == "2"
                    ? i18n.isFrench()
                      ? 15
                      : 10
                    : i18n.isFrench()
                    ? 10
                    : Platform.OS == "android"
                    ? "2.3%"
                    : "2.6%",
                fontSize:
                  global.device == "2"
                    ? i18n.isFrench()
                      ? 30
                      : 35
                    : i18n.isFrench()
                    ? 12
                    : 13,
              },
            ]}
          >
            {toastMsg}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  title: { textAlign: "left", textAlignVertical: "center", padding: 20 },
  titleLandscape: {
    textAlign: "left",
    textAlignVertical: "center",
    padding: 0,
    marginTop: -20,
  },
  container: { flex: 1, padding: 16, width: "94%", alignSelf: "center" },
  item: {
    padding: 10,
    flexWrap: "wrap",
    width: global.device == "2" ? windowWidth - 20 - 10 : windowWidth - 14 - 10,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop:
      global.device == "2" ? -20 : Platform.OS == "android" ? -15 : -12,
    marginLeft: global.device == "2" ? -20 : -19,
    // fontSize: global.device == "2" ? 35 : 17,
  },
  tinyLogo: {
    width: "50%",
    height: 150,
  },
  criteria: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingLeft: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
  image: { width: "100%", height: "80%", resizeMode: "contain" },
  imagelandscape: {
    width: "100%",
    height: Platform.OS == "android" ? "59%" : "69%",
    resizeMode: "contain",
  },
  headerLandscapeStyle: {
    borderWidth: 1,
    padding: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    elevation: 0,
    borderColor: "#CCD1D7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
    marginTop: 0,
    marginHorizontal: -50,
    width: "113%",
    paddingLeft: 30,
    paddingRight: 50,
  },
  headerPortraitStyle: {
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
    justifyContent: "space-between",
    zIndex: 2,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    marginRight: "15%",
  },
});
export default NotificationListScreen;
