/** @format */

// Tab View inside Navigation Drawer
// https://aboutreact.com/tab-view-inside-navigation-drawer-sidebar-with-react-navigation/

import "react-native-gesture-handler";

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  Modal,
  Linking,
  AppState,
  Appearance,
  Platform,
  StatusBar,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  CommonStyles,
  themeLiteral,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
  commonMenuBackground,
  commonFrameBackground,
  commonForegroundDes,
  commonBorder,
  commonForegroundColor,
  commonCardBackground,
  commonForegroundHighlightColor,
} from "../normalization.js";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import "../settings.js";
import i18n from "../resources.js";
import FollowingStackScreen from "./FollowingStackScreen";
import PublicationScreen from "./PublicationScreen";

const Tab = createMaterialTopTabNavigator();
export default function HomeTab({ navigation }) {
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [theme, setTheme] = useState(global.theme);
  const [count, setCount] = useState(0);
  const [tab, setTab] = useState(0);
  const [name, setName] = useState(i18n.t("home"));
  const [menu, setMenu] = useState(false);
  const [readAll, setReadAll] = useState(false);
  const [value, setValue] = useState(global.notificationItems.length);
  let indicator = 0;
  console.log(
    "indicator global in hometab:" + global.indicator,
    global.prevNavigateRoute
  );
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
        global.screen = "Favorite";
        global.subScreen = "Following";
        global.navigationIndicator = 0;
        console.log("Favorite get focused", global.screen, global.subScreen);
        indicator = global.indicator;
        setCount(global.indicator);
        setZoom(global.zoom);
        setBold(global.bold);
        setTheme(global.theme);
        setMenu(false);
        setName(i18n.t("favorites"));
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
      const subscriptionF = AppState.addEventListener(
        "change",
        handleAppStateChangeF
      );
      console.log("subscription removed in Favorite");
      return () => {
        if (subscriptionF) subscriptionF.remove();
        console.log("subscription removed in Favorite");
      };
    }, [])
  );
  const handleAppStateChangeF = (nextAppState) => {
    console.log(
      "Favorite detected state change:",
      global.screen,
      "sub:",
      global.subScreen,
      "State:",
      appState
    );
    if (global.screen.includes("Favorite")) {
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
            "Favorite.......App has come to the foreground! scheme:",
            global.colorScheme,
            count,
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
        console.log("err in FavoriteTab");
        return;
      }
    }
  };

  function MyTabBar({ state, descriptors, navigation }) {
    return (
      <View
        style={[
          {
            flexDirection: "row",
            height: commonZoomSize("xelarge", zoom) + 10,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                {
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 2,
                  borderWidth: 1,
                  borderTopWidth: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  elevation: 0,
                  borderColor: "#CCD1D7",
                },
                commonBackground(theme),
              ]}
            >
              <View
                style={{
                  borderBottomWidth: isFocused ? 2 : 0,
                  borderBottomColor:
                    themeLiteral() == "dark" ? "#17B8FC" : "#333333",
                  paddingVertical: 1,
                }}
              >
                <Text
                  style={[
                    {
                      color: isFocused
                        ? themeLiteral() == "dark"
                          ? "#17B8FC"
                          : "#333333"
                        : themeLiteral() == "dark"
                        ? "#F4F7FA99"
                        : "#333333B3",
                      fontWeight: isFocused ? "bold" : "normal",
                      // textDecorationLine: isFocused ? "underline" : "none",
                      paddingVertical: Platform.OS === "android" ? -1 : 10,
                      marginBottom: Platform.OS === "android" ? -1 : 0,
                    },
                    i18n.isFrench()
                      ? CommonZoomStyle("medium", { zoom })
                      : CommonZoomStyle("medium", { zoom }),
                    ,
                  ]}
                >
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
  const onLongPress = () => {
    setReadAll(true);
    global.prevNavigateRoute = "NotificationList";
    navigation.navigate("NotificationList");
  };
  const onEditPress = () => {
    global.navigationIndicator = 1;
    setMenu(false);
    navigation.navigate("SubjectsSetting");
  };
  function BadgeBell({ value, size, theme, badge }) {
    return (
      <View
        style={{ width: size + 10, height: size + 10 }}
        style={{ padding: 5, alignItems: "center" }}
      >
        <FontAwesome
          name="bell-o"
          size={size}
          style={{ color: theme === "light" ? "#26374A" : "#17B8FC" }}
        />
        {badge && (
          <View style={{fontSize: size * 0.5,position: "absolute",right: 0,top: 0,backgroundColor: theme === "light" ? "darkblue" : "cyan",width: size * 0.75,height: size * 0.75,borderRadius: (size * 0.75) / 2,}}>
              <Text style={{textAlign: "center",color: theme === "light" ? "white" : "red",}}>
                 {value > 99 ? "9+" : value}
              </Text>
          </View>
        )}
      </View>
    );
  }
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
        <View
          style={[
            {
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 5,
            },
            commonBackground(theme),
          ]}
        >
          <Text
            style={[
              CommonZoomStyle("medium", { zoom }),
              commonFontWeight({ bold }),
              commonForegroundDes(theme),
            ]}
            accessibilityRole="header"
            accessible={true}
          >
            {i18n.t("home")}
          </Text>

          <TouchableOpacity
            onPress={onLongPress}
            accessibilityRole="button"
            accessibilityLabel={i18n.t("notifications")}
            accessible={true}
          >
            <BadgeBell
              value={value}
              size={25}
              theme={themeLiteral()}
              badge={!readAll}
            />
          </TouchableOpacity>
        </View>

        <Tab.Navigator
          // initialRouteName={"Publications"}
          tabBar={(props) => <MyTabBar {...props} />}
          tabBarPosition="top"
          screenOptions={{
            gestureEnabled: false,
            headerShown: false,
            swipeEnabled: false,
            // tabBarActiveTintColor: "#17B8FC",
            // tabBarInactiveTintColor: commonForegroundColor(theme),
            // tabBarActiveBackgroundColor: "#17B8FC",
            // tabBarInactiveBackgroundColor: "#F4F7FA99",
            tabBarLabelStyle: {
              textAlign: "center",
              fontSize: 10,
              textTransform: "capitalize",
              fontWeight: "bold",
            },
            // tabBarStyle: {
            //   backgroundColor: "#17B8FC",
            // },
          }}
        >
          <Tab.Screen
            name="Publications"
            component={PublicationScreen}
            options={{
              tabBarLabel: i18n.t("all"),

              tabBarAccessibilityLabel: i18n.t("all"),
            }}
            listeners={({ navigation, route }) => {
              setTab(1);
              setMenu(false);
            }}
          />
          <Tab.Screen
            name="FollowingStack"
            component={FollowingStackScreen}
            options={{
              tabBarLabel: i18n.t("favorites"),
              tabBarAccessibilityLabel: i18n.t("favorites"),
            }}
            listeners={({ navigation, route }) => {
              setTab(0);
              setMenu(false);
            }}
          />
        </Tab.Navigator>
        {/* {Platform.OS == "android" && (
          <StatusBar
            barStyle={statusBarStyle}
            backgroundColor={statusBarColor}
          />
        )} */}
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
    //   marginTop: 20,
    marginHorizontal: Platform.OS == "android" ? "0%" : "0%",
  },
});
