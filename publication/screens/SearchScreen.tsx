/** @format */

// Tab View inside Navigation Drawer
// https://aboutreact.com/tab-view-inside-navigation-drawer-sidebar-with-react-navigation/

import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  Modal,
  Platform,
  AppState,
  Appearance,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Divider } from "react-native-elements";
import {
  themeLiteral,
  commonZoomSizeFix,
  CommonStyles,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonBackgroundSearch,
  commonForeground,
  commonButton,
  commonForegroundLabel,
  commonFrameBackground,
  commonBorder,
  commonForegroundColor,
  commonSearchBackground,
  commonForegroundDes,
  commonForegroundHighlightColor,
  commonCardBackground,
  commonTextButtonColor,
} from "../normalization.js";
import { adjustedDate } from "./AdjustedDate.tsx";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Constants from "expo-constants";
import {
  arrayGroupBy,
  decodeHtmlCharCodes,
  convertDateCategory,
  checkConnection,
} from "../services";
//import "../settings.js";
import { errorMessage } from "./ErrorMessage";
import i18n from "../resources.js";
//import StyleSettingScreen from "./StyleSetting.js";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const wid = Math.min(windowWidth / 2, windowHeight * 0.4);
const hei = wid;
const wid1 = Math.min(windowWidth / 2, windowHeight * 0.4);
const hei1 = wid1;
const mtfHeight = commonZoomSize("medium", global.zoom) * 2 + 24; //global.device == "2" ? 90 :60;
const mHeight = Math.max(windowHeight * 0.68, 2 * mtfHeight);
const mcHeight = mHeight - mtfHeight;
const msHeight = mHeight - mtfHeight;
const mt = (windowHeight - mHeight) / 2;

const colorScheme = Appearance.getColorScheme();
const SearchScreen = ({ navigation }) => {
  const textinputRef = useRef(null);
  const [count, setCount] = useState(0);
  const [name, setName] = useState(i18n.t("search"));
  const [processing, onProcessing] = useState(false);
  console.log("indicator global in search:" + global.indicator);
  const [theme, setTheme] = useState(global.theme);
  console.log("Theme in search:", theme);
  const [criteria, onChangeCriteria] = React.useState("");
  const [recentSearches, setRecentSearches] = React.useState(
    i18n.isFrench() ? global.recentSearchesF : global.recentSearchesE
  );
  const [sort, setSort] = React.useState(true);
  const [filter, setFilter] = React.useState(false);
  const [showFilter, setShowFilter] = React.useState(false);
  const [showSorter, setShowSorter] = React.useState(false);
  const [listFull, setListFull] = useState([]);
  const [list, setList] = useState([]);
  const [subs, setSubs] = useState([]);
  const [subsb, setSubsb] = useState([]);
  const [searched, setSearched] = useState(false);
  const [clean, setClean] = useState(true);
  const [offline, setOffline] = useState(false);
  const [serverDown, setServerDown] = useState(false);
  const [focused, setFocused] = useState(false);
  let index = themeLiteral() == "light" ? 0 : 1;
  const [statusBarStyle, setStatusBarStyle] = useState(global.STYLES[index]);
  const [statusBarColor, setStatusBarColor] = useState(
    Platform.OS === "ios" ? global.COLORSIOS[index] : global.COLORS[index]
  );
  const [statusBarColorShade, setStatusBarColorShade] = useState(
    Platform.OS === "ios"
      ? global.COLORSIOS[index]
      : index == 0
      ? "grey"
      : "darkBlue"
  );
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;

  const onSearch = () => {
    textinputRef.current.blur();
    if (criteria.length == 0) {
      Keyboard.dismiss();
      setList([]);
      setListFull([]);
      return;
    }
    onProcessing(true);
    setList([]);
    setListFull([]);
    if (i18n.isFrench()) {
      if (!global.recentSearchesF.some((item) => item == criteria)) {
        global.recentSearchesF.unshift(criteria);
        if (global.recentSearchesF.length > 5)
          global.recentSearchesF = global.recentSearchesF.splice(0, 5);
        setRecentSearches(global.recentSearchesF);
      }
    } else {
      if (!global.recentSearchesE.some((item) => item == criteria)) {
        global.recentSearchesE.unshift(criteria);
        if (global.recentSearchesE.length > 5)
          global.recentSearchesE = global.recentSearchesE.splice(0, 5);
        setRecentSearches(global.recentSearchesE);
      }
    }
    setSearched(true);
    setClean(false);
    Keyboard.dismiss();
    search();
  };
  const onSearchItem = (item) => {
    if (item == "") {
      Keyboard.dismiss();
      setList([]);
      setListFull([]);
      return;
    }
    onProcessing(true);
    setList([]);
    setListFull([]);
    setSearched(true);
    setClean(false);
    Keyboard.dismiss();
    onChangeCriteria(item);
    searchItem(item);
  };
  const onCancel = () => {
    textinputRef.current.blur();
    Keyboard.dismiss();
    onChangeCriteria("");
    setSearched(false);
    setClean(true);
    setShowSorter(false);
    setList([]);
    setListFull([]);
  };

  const onSort = (s) => {
    Keyboard.dismiss();
    let l = list.sort((a, b) => {
      if (!s) {
        return (
          Date.parse(a.published_date.substring(0, 19)) -
          Date.parse(b.published_date.substring(0, 19))
        );
      } else {
        return (
          Date.parse(b.published_date.substring(0, 19)) -
          Date.parse(a.published_date.substring(0, 19))
        );
      }
    });
    setList(l);
    setSort(s);
    setShowSorter(false);
  };
  const onFilter = () => {
    let sb = [];
    subs.filter((s) => s.value).forEach((it) => sb.push(it.id));
    setSubsb(sb);
    setShowFilter(!showFilter);
    setShowSorter(false);
  };
  const onCancelFilter = () => {
    let sb = subs;
    sb.forEach((it) => (it.value = false));
    for (let i = 0; i < subsb.length; i++) {
      let f = sb.find((i2) => i2.id === subsb[i]);
      if (f) f.value = true;
    }
    setSubs(sb);
    setShowFilter(false);
  };
  const onFilterSub = () => {
    let l = [];
    let sl = subs.filter((s) => s.value);
    for (let i = 0; i < listFull.length; i++) {
      let f = sl.find((i2) => i2.id === listFull[i].subject_id);
      if (f) l.push(listFull[i]);
    }
    setList(l);
    setShowFilter(!showFilter);
  };
  React.useEffect(() => {
    navigation.addListener("focus", () => {
      global.indicator++;
      global.screen = "Search";
      indicator = global.indicator;
      setCount(global.indicator);
      setName(i18n.t("search"));
      setTheme(global.theme);
      console.log("Theme in search focused:", theme);
      setSearched(false);
      setStatusBarColorShade(
        Platform.OS === "ios"
          ? global.COLORSIOS[index]
          : themeLiteral() == "light"
          ? "grey"
          : "darkBlue"
      );
      //   console.log("culture:", i18n.locale, global.publicationVersion);
      if (i18n.locale != global.searchVersion) {
        onCancel();
        global.searchVersion = i18n.locale;
      }
      //   setList([]);
      console.log("height:..........", mHeight, mtfHeight, mcHeight, mtfHeight);

      setRecentSearches(
        i18n.isFrench() ? global.recentSearchesF : global.recentSearchesE
      );
      console.log("Theme in search open:", theme);
      setShowSorter(false);
      setShowFilter(false);

      index = themeLiteral() == "light" ? 0 : 1;
      setStatusBarStyle(global.STYLES[index]);
      setStatusBarColor(
        Platform.OS === "ios" ? global.COLORSIOS[index] : global.COLORS[index]
      );
    });
    /*   const subscription = AppState.addEventListener("change", handleAppStateChange);
        return () =>{if(subscription)subscription.remove(); } */
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const subscriptionS = AppState.addEventListener(
        "change",
        handleAppStateChangeS
      );
      console.log("subscription removed in Search");
      return () => {
        if (subscriptionS) subscriptionS.remove();
        console.log("subscription removed in Search");
      };
    }, [])
  );
  const handleAppStateChangeS = (nextAppState) => {
    console.log(
      "Search detected state change:",
      global.screen,
      "sub:",
      global.subScreen,
      "State:",
      appState
    ); //if(global.screen=="Search")navigation.navigate("SearchScreen");
    if (global.screen == "Search") {
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
            "Search.......App has come to the foreground! scheme:",
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
        console.log("err in Search");
        return;
      }
    }
  };
  const search = async () => {
    if (!checkConnection()) {
      setOffline(true);
      return;
    }
    setOffline(false);
    onProcessing(true);
    let url = i18n.isFrench()
      ? global.pubApiUrlBaseFr + `article?t=${criteria}`
      : global.pubApiUrlBaseEn + `article?t=${criteria}`;
    console.log(url);
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        setList(result);
        setListFull(result);
        onProcessing(false);
        setServerDown(false);
        let items = [];

        result.forEach((it) => {
          let dd = convertDateCategory(
            it.published_date.substring(0, it.published_date.indexOf("T"))
          );
          if (!items.some((x) => x.id == it.subject_id))
            items.push({
              id: it.subject_id,
              name: it.subject_name, //  global.categories[parseInt(it.subject_id)-10].eng,  //it.subject_name,   Test only
              date: dd,
              value: true, // false,   //#58
            });
        });
        //   console.log("Filter subject list", items);
        setSubs(
          items.sort(function (a, b) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
          })
        );

        setSubs(items);
      })
      .catch((error) => {
        console.warn("error");
        setServerDown(true);
        onProcessing(false);
      });
  };
  const searchItem = async (cr) => {
    if (!checkConnection()) {
      setOffline(true);
      return;
    }
    setOffline(false);
    onProcessing(true);
    let url = i18n.isFrench()
      ? global.pubApiUrlBaseFr + `article?t=${cr}`
      : global.pubApiUrlBaseEn + `article?t=${cr}`;
    console.log(url);
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        setList(result);
        setListFull(result);
        onProcessing(false);
        setServerDown(false);
        let items = [];
        result.forEach((it) => {
          if (!items.some((x) => x.id == it.subject_id))
            items.push({
              id: it.subject_id,
              name: it.subject_name, /////  global.categories[parseInt(it.subject_id)-10].eng,  //it.subject_name,   Test only
              value: true, // false,   //#58
            });
        });
        setSubs(
          items.sort(function (a, b) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
          })
        );
        setSubs(items);
      })
      .catch((error) => {
        console.warn(error);
        setServerDown(true);
        onProcessing(false);
      });
  };
  const onRetry = () => {
    setServerDown(false);
    setOffline(false);
    onProcessing(false);
    onCancel();
  };
  function adjDate(category) {
    let str = convertDateCategory(category);
    let dl = str.split(" ");
    if (!i18n.isFrench() || dl[0] != 1)
      return (
        <Text
          style={[
            commonForegroundLabel(theme),
            { marginTop: Platform.OS === "android" ? -1 : 3 },
            global.device == "2"
              ? CommonZoomStyle("mini", { zoom })
              : CommonZoomStyle("mini", { zoom }),
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {str}
        </Text>
      );
    let s =
      global.device == "2"
        ? commonZoomSizeFix("mini4", { zoom })
        : commonZoomSizeFix("mini", { zoom });
    console.log("size:......", s);
    return (
      <View
        style={[
          { flexDirection: "row", alignItems: "center" },
          commonForegroundLabel(theme),
          { marginTop: Platform.OS === "android" ? -1 : 3 },
        ]}
      >
        <Text
          style={[
            global.device == "2"
              ? CommonZoomStyle("mini4", { zoom })
              : CommonZoomStyle("mini", { zoom }),
            styles.date,
            commonForegroundLabel(theme),
          ]}
        >
          {dl[0]}
        </Text>
        <Text
          style={[
            global.device == "2"
              ? CommonZoomStyle("mini5", { zoom })
              : CommonZoomStyle("mini1", { zoom }),
            { marginTop: -s * 0.8 },
            commonForegroundLabel(theme),
          ]}
        >
          er
        </Text>
        <Text
          style={[
            global.device == "2"
              ? CommonZoomStyle("mini4", { zoom })
              : CommonZoomStyle("mini", { zoom }),
            styles.date,
            commonForegroundLabel(theme),
          ]}
        >
          {" "}
          {dl[1]}
        </Text>
        <Text
          style={[
            global.device == "2"
              ? CommonZoomStyle("mini4", { zoom })
              : CommonZoomStyle("mini", { zoom }),
            styles.date,
            commonForegroundLabel(theme),
          ]}
        >
          {" "}
          {dl[2]}
        </Text>
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
        {Platform.OS == "android" && (
          <StatusBar
            barStyle={statusBarStyle}
            backgroundColor={showFilter ? statusBarColorShade : statusBarColor}
          />
        )}
        <View
          style={[
            commonBackground(theme),
            isLandscapeMode
              ? global.device == "2"
                ? styles.tabHeaderContainerLandscapeIpad
                : CommonStyles.tabHeaderContainerLandscape
              : CommonStyles.tabHeaderContainer,
          ]}
          onPress={() => {
            Keyboard.dismiss();
            setShowSorter(false);
          }}
        >
          <Text
            style={[
              CommonZoomStyle("medium", { zoom }),
              commonFontWeight({ bold }),
              commonForegroundDes(theme),
              isLandscapeMode
                ? CommonStyles.tabHeaderTitleLandscape
                : CommonStyles.tabHeaderTitle,
            ]}
            onPress={() => {
              Keyboard.dismiss();
            }}
            accessibilityRole="header"
            accessible={true}
          >
            {name}
          </Text>
        </View>
        <View
          style={[
            styles.criteriaContainer,
            commonBackground(theme),
            { alignItems: "center", width: "100%" },
          ]}
        >
          <View
            style={[
              styles.criteria,
              
              {
                backgroundColor:
                  theme == 2
                    ? "#29415C"
                    : theme == 1
                    ? "#7676801F"
                    : colorScheme == "light"
                    ? "#7676801F"
                    : "#29415C",
              },
            ]}
          >
            <View
              style={{
                width: commonZoomSizeFix("medium", zoom) + 2,
                marginRight: 4,
              }}
            >
              {themeLiteral() == "light" ? (
                <Feather
                  name="search"
                  size={commonZoomSizeFix("medium", zoom)}
                  style={styles.searchIcon}
                  accessibilityRole="image"
                  accessible={true}
                />
              ) : (
                <Feather
                  name="search"
                  size={commonZoomSizeFix("medium", zoom)}
                  style={styles.searchIcon2}
                  accessibilityRole="image"
                  accessible={true}
                />
              )}
            </View>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flexGrow: 1 }}
            >
              <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                style={{ width: "100%" }}
              >
                <TextInput
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  ref={textinputRef}
                  style={[
                    criteria.length > 0
                      ? CommonZoomStyle("medium", { zoom })
                      : global.device == "2"
                      ? { fontSize: 25 }
                      : { fontSize: 15 },
                    {
                      width: "85%",
                      maxWidth: "85%",
                      minHeight: 35,
                      color: themeLiteral() == "light" ? "black" : "white",
                    },
                  ]}
                  onChangeText={onChangeCriteria}
                  value={criteria}
                  returnKeyType="search"
                  keyboardAppearance="light"
                  blurOnSubmit={true}
                  onSubmitEditing={onSearch}
                  maxLength={150}
                  placeholder={i18n.t("searchPlacehoder")}
                  placeholderTextColor={
                    themeLiteral() == "light" ? "#3C3C4399" : "#F4F7FA99"
                  }
                />
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            {criteria.length > 0 && (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: commonZoomSizeFix("medium", zoom),
                  position: "absolute",
                  top: 0,
                  right: 0,
                  marginRight: 0,
                  alignItems: "center",
                  height: "100%",
                }}
                onPress={() => {
                  onChangeCriteria("");
                  setSearched(false);
                  setClean(true);
                  setShowSorter(false);
                }}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel={i18n.t("searchclear")}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={commonZoomSizeFix("medium", zoom)}
                  style={{
                    marginLeft: -20,
                    padding: -20,
                    color: themeLiteral() == "light" ? "#1C2939" : "white",
                    alignSelf: "center",
                    // marginTop: global.device == "2" ? 15 : 5,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
          {(criteria.length > 0 || list.length > 0) && (
            <TouchableOpacity
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel={i18n.t("Cancel")}
              onPress={onCancel}
              style={{
                width: "30%",
                marginLeft: isLandscapeMode
                  ? global.device == "2"
                    ? "-16%"
                    : "-11%"
                  : "-11%",
                marginRight: 0,
                alignItems: "flex-end",
              }}
            >
              <Text
                style={[
                  CommonZoomStyle("medium", { zoom }),
                  commonTextButtonColor(theme),
                ]}
              >
                {i18n.t("Cancel")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.container}>
          {(offline || serverDown) && errorMessage(offline, onRetry, 1, name)}

          {clean && list.length == 0 && recentSearches.length > 0 && (
            <View>
              <Text
                style={[
                  CommonZoomStyle("medium", { zoom }),
                  commonForeground(theme),
                  {
                    fontWeight: "bold",
                    marginLeft: 17,
                    marginBottom: 10,
                    marginTop: 15,
                  },
                ]}
              >
                {i18n.t("recentSearches")}
              </Text>
              <FlatList
                style={styles.recentSearches}
                data={recentSearches}
                keyExtractor={(item, index) => `searchKeyword${index}`}
                renderItem={({ item, index }) => (
                  <View>
                    <TouchableOpacity onPress={() => onSearchItem(item)}>
                      <Text
                        style={[
                          { textAlign: "left", marginBottom: 5 },
                          CommonZoomStyle("medium", { zoom }),
                          commonForeground(theme),
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}
          {!searched && list.length == 0 && recentSearches.length == 0 && (
            <View
              style={{
                justifyContent: "space-around",
                padding: 15,
                height: "100%",
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  Keyboard.dismiss();
                }}
              >
                <Text
                  style={[
                    isLandscapeMode
                      ? styles.screenMsg
                      : styles.screenMsgLandscape,
                    global.device == "2"
                      ? CommonZoomStyle("mini", { zoom })
                      : CommonZoomStyle("small", { zoom }),
                    commonForeground(theme),
                  ]}
                >
                  {i18n.t("searchScreenMsg")}
                </Text>
              </TouchableWithoutFeedback>
              {!focused && (
                <View style={{ alignItems: "center" }}>
                  <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    style={{ width: "100%" }}
                  >
                    {themeLiteral() == "light" ? (
                      <Image
                        style={[
                          isLandscapeMode
                            ? styles.imageLandscape
                            : styles.image,
                        ]}
                        source={require("../assets/Accessible_wheel_chair.png")}
                      />
                    ) : (
                      <Image
                        style={[
                          isLandscapeMode
                            ? styles.imageLandscape
                            : styles.image,
                        ]}
                        source={require("../assets/Accessible_wheel_chair.png")}
                      />
                    )}
                  </TouchableWithoutFeedback>
                </View>
              )}
            </View>
          )}
          {!processing && searched && list.length == 0 && (
            <View
              style={{
                justifyContent: "space-around",
                padding: 15,
                height: "100%",
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  Keyboard.dismiss();
                }}
              >
                <Text
                  style={[
                    styles.screenMsg,
                    global.device == "2"
                      ? CommonZoomStyle("mini", { zoom })
                      : CommonZoomStyle("small", { zoom }),
                    commonForeground(theme),
                  ]}
                >
                  {i18n.t("noResultFound")}
                </Text>
              </TouchableWithoutFeedback>
              <View style={{ alignItems: "center" }}>
                <TouchableWithoutFeedback
                  onPress={Keyboard.dismiss}
                  style={{ width: "100%" }}
                >
                  {themeLiteral() == "light" ? (
                    <Image
                      style={[
                        styles.image,
                        { resizeMode: "contain", width: wid1, height: hei1 },
                      ]}
                      source={require("../assets/tempsearch.png")}
                    />
                  ) : (
                    <Image
                      style={[
                        styles.image,
                        { resizeMode: "contain", width: wid1, height: hei1 },
                      ]}
                      source={require("../assets/No_search-results_dark.png")}
                    />
                  )}
                </TouchableWithoutFeedback>
              </View>
            </View>
          )}
          {processing && !offline && !serverDown && (
            <ActivityIndicator
              size="large"
              color={themeLiteral() == "light" ? "black" : "white"}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                zIndex: 20,
              }}
            />
          )}
          {list.length > 0 && (
            <View
              style={[
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 5,
                  marginTop: 15,
                },
              ]}
            >
              <TouchableOpacity
                accessibilityRole="none"
                accessible={true}
                accessibilityRole="menubar"
                accessibilityLabel={i18n.t("sort")}
                style={[styles.criteriaSort,
                  commonCardBackground(theme)]}
                onPress={() => setShowSorter(!showSorter)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={[
                      CommonZoomStyle("small", { zoom }),
                      commonForeground(theme),
                      {  flexGrow: 1 },
                    ]}
                  >
                    {i18n.t("sort")}
                  </Text>
                  {sort ? (
                    <Text
                      style={[
                        CommonZoomStyle("small", { zoom }),
                        commonForeground(theme),
                       
                      ]}
                    >
                      ▼
                    </Text>
                  ) : (
                    <Text
                      style={[
                        CommonZoomStyle("small", { zoom }),
                        commonForeground(theme),
                     
                      ]}
                    >
                      ▲
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                accessible={true}
                style={[
                  styles.criteriaFilter,
                  commonCardBackground(theme),
                  
                  {
                    width: "55%",
                    // backgroundColor: "white",
                  },
                ]}
                onPress={onFilter}
              >
                {filter ? (
                  <View>
                    <Text
                      style={[
                        CommonZoomStyle("small", { zoom }),
                        commonForeground(theme),
                        {
                          // color: "#000000",
                          marginHorizontal: 10,
                          textAlign: "center",
                        },
                      ]}
                    >
                      {i18n.t("filter")}✓
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={[
                      CommonZoomStyle("small", { zoom }),
                      commonForeground(theme),
                      {
                        // color: "#000000",
                        marginHorizontal: "10%",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {i18n.t("filter")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          {showSorter && (
            <View style={[commonCardBackground(theme),
              styles.sortMenu
]}>
              <TouchableOpacity
              // style={commonCardBackground(theme)}
                accessibilityRole="menu"
                accessible={true}
                onPress={() => onSort(true)}
              >
                <Text
                  style={[
                    { marginVertical: 5, marginHorizontal: 8 },
                    CommonZoomStyle("small", { zoom }),
                    commonForeground(theme),
                  ]}
                >
                  {i18n.t("newToOld")}{" "}
                  <Text style={{ fontSize: 28 }}>{sort ? "✓" : ""}</Text>
                </Text>
              </TouchableOpacity>
              <View style={styles.divider}></View>
              <TouchableOpacity
              
                accessibilityRole="menu"
                accessible={true}
                onPress={() => onSort(false)}
              >
                <Text
                  style={[
                    { marginVertical: 5, marginHorizontal: 8 },
                    CommonZoomStyle("small", { zoom }),
                    commonForeground(theme),
                   
                  ]}
                >
                  {i18n.t("oldToNew")}{" "}
                  <Text style={{ fontSize: 28 }}>{!sort ? "✓" : ""}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showFilter}
            onRequestClose={() => setShowFilter(false)}
            style={{ width: "100%" }}
          >
            <View
              style={[
                commonBackground(theme),
                isLandscapeMode
                  ? styles.modalContainerLandscape
                  : styles.modalContainer,
              ]}
            >
              {Platform.OS == "android" && (
                <StatusBar
                  barStyle={statusBarStyle}
                  backgroundColor={statusBarColorShade}
                />
              )}
              <View
                style={[
                  commonBackground(theme),
                  styles.modal,
                  { height: mHeight, marginTop: mt * 2 },
                ]}
              >
                <View style={{ height: mcHeight }}>
                  <View style={[styles.subjects, { height: mtfHeight }]}>
                    <Text
                      style={[
                        CommonStyles.mediumFont,
                        commonForegroundDes(theme),
                        commonForeground(theme),
                        styles.label,
                        { fontWeight: "bold" },
                      ]}
                    >
                      {i18n.t("filter")}
                    </Text>

                    <TouchableOpacity
                      accessibilityRole="button"
                      accessible={true}
                      accessibilityLabel={i18n.t("close")}
                      onPress={onCancelFilter}
                    >
                      <View
                        style={[styles.checkerContainer, { borderWidth: 0 }]}
                      >
                        <Feather
                          name="x"
                          size={global.device == "2" ? 50 : 24}
                          style={[commonForegroundDes(theme), styles.closeIcon]}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    style={[
                      commonBackground(theme),
                      styles.scrollView,
                      { height: msHeight },
                    ]}
                  >
                    {subs.map((n, index) => (
                      <TouchableOpacity
                        accessibilityRole="button"
                        accessible={true}
                        onPress={() => {
                          n.value = !n.value;
                          setSubs([...subs]);
                        }}
                        key={`category${index}`}
                      >
                        <View key={`cate${index}`} style={styles.subjects}>
                          <Text
                            style={[
                              CommonZoomStyle("medium", { zoom }),
                              commonForegroundDes(theme),
                              styles.label,
                              ,
                            ]}
                          >
                            {n.name}
                          </Text>
                          <View
                            style={[
                              commonBorder(theme),
                              styles.checkerContainer,
                              {
                                width: commonZoomSize("medium", zoom) + 10,
                                height: commonZoomSize("medium", zoom) + 10,
                                borderRadius:
                                  commonZoomSize("medium", zoom) / 10,
                              },
                            ]}
                          >
                            {n.value && (
                              <Image
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  resizeMode: "contain",
                                }}
                                source={require("../assets/Option_checked.png")}
                              />
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: mtfHeight,
                  }}
                >
                  <TouchableOpacity
                    style={[styles.apply,
                      commonButton(theme)]}
                    accessibilityRole="button"
                    accessible={true}
                    onPress={onFilterSub}
                  >
                    <Text
                      style={[
                        CommonStyles.mediumFont,
                        commonForeground(theme),
                        {  fontWeight: "bold" },
                      ]}
                    >
                      {i18n.t("apply")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {list.length > 0 && (
            <View
              style={[
                {
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                },
              ]}
            >
              <Text
                style={[
                  {
                    marginVertical: 10,
                    marginBottom: 20,
                    color: themeLiteral() == "light" ? "#000000" : "#FFFFFF",
                  },
                  CommonZoomStyle("small", { zoom }),
                  ,
                ]}
              >
                {list.length}{" "}
                {list.length == 1
                  ? i18n.t("resultFound")
                  : i18n.t("resultsFound")}
              </Text>
            </View>
          )}
          <FlatList
            style={{ width: "100%" }}
            data={list}
            keyExtractor={(item, index) => `result${index}`}
            renderItem={({ item, index }) => (
              <View
                id={index}
                style={[
                  commonCardBackground(theme),
                  CommonStyles.cardContainer,
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    global.prevNavigateRoute = "SearchScreen";
                    global.articleId = item.id;
                    navigation.navigate("DisplayArticle", { item: item });
                  }}
                >
                  <View style={CommonStyles.cardViewSmall}>
                    <View style={{ width: "72%", padding: 10 }}>
                      <Text
                        style={[
                          CommonZoomStyle("small", { zoom }),
                          commonForeground(theme),
                          { fontWeight: "bold" },
                        ]}
                        numberOfLines={4}
                        ellipsizeMode="tail"
                      >
                        {decodeHtmlCharCodes(item.title)}
                      </Text>
                      <Text
                        style={[
                          CommonZoomStyle("small", { zoom }),
                          commonForeground(theme),
                        ]}
                        numberOfLines={4}
                        ellipsizeMode="tail"
                      >
                        {item.subject_name}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        {adjustedDate(
                          convertDateCategory(item.published_date),
                          zoom,
                          theme,
                          false
                        )}
                      </View>
                    </View>
                    <Image
                      style={{ width: "28%", height: "100%" }}
                      source={{ uri: item.branding_image_src }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  screenMsg: {
    textAlign: "center",
    textAlignVertical: "center",
  },
  screenMsgLandscape: {
    textAlign: "center",
    textAlignVertical: "center",
    paddingBottom: Platform.OS == "android" ? "10%" : "7%",
  },
  container: { flex: 1, padding: 5, width: "95%", alignSelf: "center" },
  criteriaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    paddingHorizontal: "3%",
    marginTop: 8,
  },
  itemContainer: {
    // No use
    padding: 0,
    flexDirection: "column",
    width: "72%",
    marginLeft: "3%",
  },
  item: {
    paddingVertical: 0,
    marginBottom: 5,
    marginLeft: Platform.OS === "android" ? "0%" : "0%",
    marginRight: Platform.OS === "android" ? "6%" : "6%",
    fontWeight: "bold",
    borderRadius: 10,
    paddingBottom: 10,
    marginTop: 5,
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
  tinyLogo: {
    height: Platform.OS === "android" ? 222 : 205,
    width: 150,
    marginTop: -18,
    marginBottom: -4,
    marginLeft: -1,
    overflow: "hidden",
  },
  criteria: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
    borderRadius: 10,
    marginLeft: 3,
    flex: 1,
    //  backgroundColor: themeLiteral() == "light" ? "#7676801F" : "#29415C",
    //   backgroundColor:theme == 2?"#29415C":theme == 1 ?"#7676801F":colorScheme == "light" ? "#7676801F":"#29415C"
  },
  criteriaSort: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
    borderRadius: 7,
    padding: 7,
    width: "41%",
    backgroundColor: "white",
  },
  criteriaFilter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7676801F",
    paddingLeft: 8,
    borderRadius: 7,
    padding: 7,
  },
  recentSearches: { marginLeft: 20 },

  /*   image: {   //no use
    width: "100%",
    height: global.device == "2" ? "85%" : "90%",
    resizeMode: "contain",
  }, */
  modal: {
    width: "100%",
    // height: "80%",
    //  justifyContent: "space-between",
    // alignSelf: "flex-end",
    //  marginTop: "15%",
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 10, //borderWidth:1,borderColor:'red',marginBottom:0,
  },
  modalContainer: {
    height: windowHeight,
    //  justifyContent: 'center',//backgroundColor:'lightgray',
    //   alignItems: 'center',//
    //   Opacity:0.5,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainerLandscape: {
    height: windowHeight,
    backgroundColor: "rgba(0,0,0,0.5)",
    marginVertical: "-8%",
  },
  /*   nosearchImage: {   //No use
    width: "100%",
    height: "70%",
    resizeMode: "contain",
  }, */
  apply: {
    borderRadius: 5,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    // backgroundColor: "#26374A",
    width: "90%",
    minHeight: 25,
  },
  checkerContainer: {
    borderWidth: 1,
    marginRight: 5,
    //  borderRadius: commonZoomSize("medium", zoom) / 10,
    //   width: commonZoomSize("medium", zoom),
    //   height: commonZoomSize("medium", zoom),
    borderColor: themeLiteral() == "light" ? "#26374A" : "#F4F7FA99",
    alignItems: "center",
    justifyContent: "center",
  },
  closerContainer: {
    marginRight: 5,
    minWidth: 50, //height:global.device == "2" ?80:40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  label: { width: "80%" },
  labelContainer: {
    flexDirection: "row",
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    justifyContent: "space-between",
  },

  imageContainer: {
    width: "28%",
    padding: 0,
    marginTop: Platform.OS === "android" ? "0%" : "0%",
    marginHorizontal: "2%",
  },
  searchIcon: {
    marginLeft: 2,
    // color: themeLiteral() == "light" ? "#3C3C4399" : "#F4F7FA99",
    color: "#3C3C4399",
  },

  searchIcon2: {
    marginLeft: 2,
    color: "#F4F7FA99",
  },
  sortMenu: {
    // backgroundColor: "white",
    justifyContent: "space-between",
    width: "70%",
    alignItems: "flex-start",
    marginVertical: 10,
    paddingVertical: 5,
    borderRadius: 5,
    position: "absolute",
    top: Platform.OS == "android" ? "8%" : "8%",
    left: "1%",
    shadowOffset: {
      width: 3,
      height: 10,
    },
    shadowOpacity: 1, // IOS
    shadowRadius: 3, //IOS
    shadowColor: "rgba(0,0,0, .4)", // IOS
    zIndex: 200,
    borderWidth: 1,
    elevation: 10, // Android,
    borderColor: "#92A8C14D",
  },
  divider: {
    height: 1,
    width: "96%",
    borderWidth: 1,
    borderColor: "lightgray",
    marginLeft: 6,
  },
  closeIcon: {
    //paddingVertical:19
  },
  image: {
    resizeMode: "contain",
    width: wid,
    height: hei,
  },
  imageLandscape: {
    resizeMode: "contain",
    width: wid,
    height: Platform.OS == "android" ? "88%" : "85%",
    marginTop: Platform.OS == "android" ? "3%" : '4%',
  },
  modalContent: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    elevation: 0,
    width: "100%",
    borderColor: "#CCD1D7",
    marginTop: -10,
    marginBottom: 10,
  },
  scrollView: {
    width: "100%",
    minHeight: 300,
    //  maxHeight: '80%',
    borderRadius: 2,
    //  borderWidth: 1,
    // borderColor: "white",
    marginBottom: 5,
  },
  subjects: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageOffline: {
    width: "100%",
    height: "60%",
    resizeMode: "contain",
    //   marginBottom: 10,
    //   paddingTop: 15,
  },
  retryBtn: {
    backgroundColor: "#333333",
    width: Platform.OS === "android" ? "46%" : "45%",
    //  height: Platform.OS === "android" ? "9%" : "8%",
    borderRadius: 5,
    padding: 0,
    paddingTop: Platform.OS === "android" ? "0%" : "-10%",
    justifyContent: "center",
    alignItems: "center",
  },
  titleOffline: {
    textAlign: "left",
    marginBottom: 16,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  category: {
    fontWeight: "bold",
    paddingHorizontal: global.device == "2" ? 60 : 26,
    paddingTop: Platform.OS === "android" ? 0 : -10,
    paddingBottom: Platform.OS === "android" ? 0 : 10,
    marginBottom: Platform.OS === "android" ? 10 : 10,
    marginTop: 10,
  },
  date: {},
  superscript: { marginTop: -20 },

  ///////
  card: {
    //no use
    borderWidth: 0,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 10,
    marginLeft: "2%",
    marginTop: "2%",
  },
});

export default SearchScreen;
