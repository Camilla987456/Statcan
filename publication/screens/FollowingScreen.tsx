/** @format */

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
  ScrollView,
  Dimensions,
  Modal,
  Platform,
  AppState,
  Appearance,
  ActivityIndicator,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CommonStyles,
  themeLiteral,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
  commonFrameBackground,
  commonBorder,
  commonForegroundHighlightColor,
  commonCardBackground,
  commonForegroundDes,
  commonButton,
  commonBackgroundColor,
  commonSettingBackground,
} from "../normalization.js";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import {
  arrayGroupBy,
  decodeHtmlCharCodes,
  checkConnection,
} from "../services";
import "../settings.js";
import { errorMessage } from "./ErrorMessage";
import i18n from "../resources.js";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const wid = windowWidth - 40;
const hei = (744 / 1314) * wid;

const mtfHeight = commonZoomSize("medium", global.zoom) * 2 + 24; //global.device == "2" ? 90 :60;
const mHeight = Math.max(windowHeight * 0.9, 2 * mtfHeight);
const mcHeight = mHeight - mtfHeight;
const msHeight = mHeight - mtfHeight;
const mt = (windowHeight - mHeight) / 2;

let lll = [];

const FollowingScreen = ({ navigation }) => {
  const [offline, setOffline] = useState(false);
  const [serverDown, setServerDown] = useState(false);

  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [theme, setTheme] = useState(global.theme);
  const [count, setCount] = useState(0);
  const [name, setName] = useState(i18n.t("following"));
  const [subject, setSubject] = useState(i18n.t("selectSubjects"));
  const [following, setFollowing] = useState(i18n.t("selectSubject"));
  const [seeall, setSeeAll] = useState(i18n.t("seeAll"));
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();
  let index = themeLiteral() == "light" ? 0 : 1;
  const [statusBarStyle, setStatusBarStyle] = useState(global.STYLES[index]);
  const [statusBarColor, setStatusBarColor] = useState(
    Platform.OS === "ios" ? global.COLORSIOS[index] : global.COLORS[index]
  );
  const [statusBarColorShade, setStatusBarColorShade] = useState(
    Platform.OS === "ios"
      ? global.COLORSIOS[index]
      : index == 0
      ? "dark"
      : "darkBlue"
  );
  const [showFilter, setShowFilter] = React.useState(false);
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  const [subjects, setSubjects] = useState([]);
  let theDay = new Date();
  const today = `${theDay.getFullYear()}-${
    theDay.getMonth() + 1
  }-${theDay.getDate()}`;

  //global.prevNavigateRoute = "";
  let indicator = 0;
  React.useEffect(() => {
    navigation.addListener("blur", (e) => {
      setTimeout(() => {
        console.log("publication losts focus");
      }, 1000);
    });
    navigation.addListener("focus", () => {
      setLoading(true);
      global.indicator++;
      global.screen = "Favorite";
      global.subScreen = "Following";
      console.log(
        "Following gets focused.............",
        global.screen,
        global.subScreen
      );
      indicator = global.indicator;
      setCount(global.indicator);
      setZoom(global.zoom);
      setBold(global.bold);
      setTheme(global.theme);
      setName(i18n.t("following"));
      setFollowing(i18n.t("selectSubject"));
      setSubject(i18n.t("selectSubjects"));
      if (global.followingsDirty || i18n.locale != global.followingVersion) {
        getFollowingList();
        global.followingsDirty = false;
        global.followingVersion = i18n.locale;
      }
      setSeeAll(i18n.t("seeAll"));

      lll = i18n.isFrench()
        ? global.subjectItems.sort(function (a, b) {
            return a.fre < b.fre ? -1 : a.fre > b.fre ? 1 : 0;
          })
        : global.subjectItems.sort(function (a, b) {
            return a.eng < b.eng ? -1 : a.eng > b.eng ? 1 : 0;
          });
      setSubjects(lll);
      setLoading(false);
    });
    getFollowingList();
    global.screen = "Favorite";
    global.subScreen = "Following";

    lll = i18n.isFrench()
      ? global.subjectItems.sort(function (a, b) {
          return a.fre < b.fre ? -1 : a.fre > b.fre ? 1 : 0;
        })
      : global.subjectItems.sort(function (a, b) {
          return a.eng < b.eng ? -1 : a.eng > b.eng ? 1 : 0;
        });
    setSubjects(lll);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const subscriptionFl = AppState.addEventListener(
        "change",
        handleAppStateChangeFl
      );
      console.log("subscription removed in Following");
      return () => {
        if (subscriptionFl) subscriptionFl.remove();
        console.log("subscription removed in Following");
      };
    }, [])
  );
  const handleAppStateChangeFl = (nextAppState) => {
    console.log(
      "Following detected state change come here:",
      global.screen,
      "subScreen:",
      global.subscreen,
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
            "Following.......App has come to the foreground! scheme:",
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
        console.log("err in Following");
        return;
      }
    }
  };

  const onEditPress = () => {
    //Old logic:
    //  global.navigationIndicator = 1;
    //  global.prevNavigateRoute = "FollowingScreen";
    //  navigation.navigate('SettingScreen', { screen: 'SubjectsSetting' });
    setShowFilter(true);
  };
  const onRetry = () => {
    console.log("retry");
    setOffline(false);
    setServerDown(false);
    getFollowingList();
  };
  const onCancelFilter = () => {
    setShowFilter(false);
    setLoading(false);
  };
  const onSaveFilter = () => {
    setShowFilter(false);
    setLoading(true);
    let l = global.subjectItems
      .filter((s) => s.value)
      .map(function (e) {
        return { key: e.key, value: e.value, date: e.date };
      });
    AsyncStorage.setItem("Subjects", JSON.stringify(l));
    global.subjects = l;
    global.followingsDirty = true;
    getFollowingList();
    global.followingsDirty = false;
    setLoading(false);
  };
  const getFollowingList = async () => {
    if (!checkConnection()) {
      setOffline(true);
      setLoading(false);
      return;
    }
    setOffline(false);
    if (global.subjectItems.filter((n) => n.value).length == 0) return [];
    setLoading(true);
    let followings = [];
    let url = i18n.isFrench()
      ? global.pubApiUrlBaseFr + "following"
      : global.pubApiUrlBaseEn + "following";
    let data = [];
    global.subjects.forEach(function (x) {
      if (x.value) data.push({ subject_id: x.key });
    });
    console.log(url, data);

    try {
      const response = await fetch(url, {
        method: "POST",

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      setServerDown(false);
      console.log(
        "response status",
        response.status,
        "list count:",
        json.length
      );
      json.forEach(function (x) {
        let key = x.subject.subject_name;
        let value = [];
        for (let i = 0; i < Math.min(10, x.followings.length); i++) {
          value.push({
            id: x.followings[i].id,
            title: decodeHtmlCharCodes(x.followings[i].title),
            category: x.followings[i].subject_name,
            categoryId: x.followings[i].subject_id,
            date: x.followings[i].published_date,
            image: x.followings[i].branding_image_src,
            imageLabel: x.followings[i].branding_image_alt,
          });
        }
        followings.push({ key: key, value: value });
      });
      followings = followings.sort(function (a, b) {
        return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
      });
      setList(followings);
      setLoading(false);
    } catch (error) {
      console.log("error");
      setServerDown(true);
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  function RenderItem({ data }) {
    const h = 4;
    let w = windowWidth - 30;
    if (data.length > 1) w = (windowWidth - 30) / 1.5;
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ padding: 10 }}
      >
        {data.map((it, ind) => {
          return (
            <View
              key={ind}
              style={[
                commonCardBackground(theme),
                {
                  borderColor: "black",
                  borderWidth: 0,
                  borderRadius: 20,
                  overflow: "hidden",
                  marginTop: Platform.OS == "ios" ? -10 : 0,
                  paddingVertical: 0,
                  paddingHorizontal: -10,
                  marginEnd: 10,
                  marginHorizontal: 6,
                },
              ]}
            >
              <TouchableOpacity
                style={{ padding: 5 }}
                onPress={() => {
                  global.prevNavigateRoute = "Following";
                  global.articleId = it.id;  console.log('route in Follwoing:',global.prevNavigateRoute);
                  navigation.navigate("DisplayArticle", { item: it });
                }}
              >
                {it.image != "" && (
                  <Image
                    style={{
                      width: "110%",
                      height: windowHeight / h,
                      resizeMode: "cover",
                      overflow: "hidden",
                      borderWidth: 0,
                      marginLeft: -6,
                      marginTop: Platform.OS == "ios" ? -10 : -7,
                    }}
                    source={{ uri: it.image }}
                  />
                )}
                <Text
                  style={[
                    {
                      width: w,
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      paddingBottom: 5,
                    },
                    CommonZoomStyle("mini", { zoom }),
                    commonForeground(theme),
                  ]}
                  numberOfLines={4}
                  ellipsizeMode="tail"
                >
                  {it.title}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    );
  }
  function renderNoCategory() {
    return (
      <>
        <View
          style={[
            {
              justifyContent: "space-around",
              alignItems: "center",
              padding: 10,
              height: "100%",
            },
            commonBackground(theme),
          ]}
        >
          <Text
            style={[
              {
                width: "100%",
                paddingHorizontal: 10,
                textAlignVertical: "center",
                textAlign: "center",
                marginHorizontal: 16,
                marginVertical:isLandscapeMode?global.device=='2'?40:6:6,
              },
              CommonZoomStyle("small", { zoom }),
              commonForeground(theme),
              i18n.isFrench()
                ? CommonZoomStyle("mini", { zoom })
                : CommonZoomStyle("small", { zoom }),
            ]}
          >
            {following}
          </Text>
          <TouchableOpacity
            onPress={onEditPress}
            style={[commonButton(theme),
              styles.subjectBtn,
              { height: isLandscapeMode ?global.device=='2'?"10%": "15%" : "10%", marginTop:  isLandscapeMode ? global.device=='2'?25:14 :14},
            ]}
            accessible={true}
            accessibleRole="button"
          >
            <Text
              style={[
                { color: "#FFFFFF", alignSelf: "center", paddingVertical: 5 },
                CommonStyles.mediumFont,
                i18n.isFrench()
                  ? Platform.OS == "android"
                    ? CommonZoomStyle("mini", { zoom })
                    : CommonZoomStyle("small", { zoom })
                  : CommonZoomStyle("small", { zoom }),
              ]}
            >
              {subject}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: "100%",
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={
                isLandscapeMode ? styles.imageLandscape : styles.imagePotrait
              }
              source={require("../assets/Following.png")}
            />
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showFilter}
          onRequestClose={() => setShowFilter(false)}
          style={{ width: "100%" }}
        >
          <View style={[commonBackground(theme), styles.modalContainer]}>
            {Platform.OS == "android" && (
              <StatusBar barStyle={statusBarStyle} backgroundColor={"grey"} />
            )}
            <View
              style={[
                commonBackground(theme),
                styles.modal,
                { height: mHeight, marginTop: mt * 2 },
              ]}
            >
              <View style={[commonBackground(theme),{ height: mcHeight }]}>
                <View style={[styles.subjects, { height: mtfHeight }]}>
                  <Text
                    style={[
                      CommonStyles.mediumFont,
                      commonForegroundDes(theme),
                      styles.label,
                      { fontWeight: "bold" },
                    ]}
                  >
                    {i18n.t("subjectsFollowing")}
                  </Text>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessible={true}
                    accessibilityLabel={i18n.t("close")}
                    onPress={onCancelFilter}
                  >
                    <View style={[styles.checkerContainer, { borderWidth: 0 }]}>
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
                    commonSettingBackground(theme),
                    styles.scrollView,
                    { height: msHeight },
                  ]}
                >
                  {subjects.map((n, index) => (
                    <TouchableOpacity
                      accessibilityRole="checkbox"
                      accessible={true}
                      onPress={() => {
                        n.value = !n.value;
                        lll[index].value = n.value;
                        lll[index].date = n.value ? today : "";
                        setSubjects([...lll]);
                        setLoading(false);
                        setShowFilter(true);
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          margin: 10,
                          marginTop: 5,
                          borderBottomWidth: 1,
                          borderBottomColor: "lightgray",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={[
                            CommonZoomStyle("medium", { zoom }),
                            commonForegroundDes(theme),
                            styles.subjectlabel,
                          ]}
                        >
                          {i18n.isFrench() ? n.fre : n.eng}
                        </Text>
                        <View
                          style={[
                            commonBorder(theme),
                            styles.subjectCheckerContainer,
                          ]}
                        >
                          {n.value && (
                            <Image
                              style={{
                                width: global.device == "2" ? "97%" : "100%",
                                height: global.device == "2" ? "98%" : "100%",
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
                style={[commonBackground(theme),{
                  justifyContent: "center",
                  alignItems: "center",
                  height: mtfHeight,
                }]}
              >
                <TouchableOpacity
                
                style={[commonButton(theme),styles.apply]}
                  accessibilityRole="button"
                  accessible={true}
                  onPress={onSaveFilter}

                >
                  <Text
                    style={[
                      CommonStyles.mediumFont,
                      { color: "white", fontWeight: "bold" },
                    ]}
                  >
                    {i18n.t("save")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
  return (
    <SafeAreaView>
      {offline || serverDown ? (
        errorMessage(offline, onRetry, 2, name)
      ) : global.subjectItems.filter((n) => n.value).length == 0 ||
        showFilter ? (
        renderNoCategory()
      ) : loading ? (
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
      ) : list.length == 0 ? (
        <View
          style={[
            {
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              paddingVertical: Platform.OS === "android" ? 10 : 25,
              paddingBottom: Platform.OS === "android" ? 10 : 25,
            },
            commonBackground(theme),
          ]}
        >
          <Text
            style={[
              styles.title,
              CommonZoomStyle("mini", { zoom }),
              commonForeground(theme),
            ]}
          >
            {following}
          </Text>
          <View style={styles.subjectBtn}>
            <TouchableOpacity 
               onPress={onEditPress}
              accessible={true}
              accessibleRole="button"
              
            >
              <Text
                style={[
                  {
                    color: "#FFFFFF",
                    alignSelf: "center",
                    paddingVertical: 5,
                  },
                  CommonStyles.mediumFont,
                ]}
              >
                {subject}
              </Text>
            </TouchableOpacity>
          </View>
          <Image
            style={styles.image}
            source={require("../assets/Following.png")}
          />
        </View>
      ) : (
        <ScrollView style={commonBackground(theme)}>
          {list.map((item, index) => {
            return (
              <View key={index}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 5,
                    paddingVertical: Platform.OS === "android" ? 10 : 10,
                    marginBottom: Platform.OS === "android" ? -20 : 0,
                    marginLeft: 16,
                    marginRight: 16,
                  }}
                >
                  <Text
                    style={[
                      {
                        fontWeight: "bold",
                        maxWidth: "50%",
                      },
                      ,
                      commonForeground(theme),
                      CommonZoomStyle("small", { zoom }),
                    ]}
                  >
                    {item.key}
                  </Text>
                  {item.value && item.value.length >= 1 && (
                    <TouchableOpacity
                      style={[
                        {
                          alignSelf: "flex-end",
                          margin: 10,
                          marginTop: Platform.OS === "android" ? 1 : 1,
                          marginRight: isLandscapeMode ? "5%" : 0,
                        },
                        commonForeground(theme),
                      ]}
                      onPress={() => {
                        navigation.navigate("FollowingList", {
                          items: item.value,
                        });
                      }}
                    >
                      <Text
                        style={[
                          CommonZoomStyle("small", { zoom }),
                          commonForeground(theme),
                        ]}
                      >
                        {i18n.t("seeAll")}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {item.value && item.value.length > 0 && (
                  <RenderItem data={item.value} />
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    borderTopColor: "gray",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  title: {
    textAlign: "left",
    marginBottom: 16,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  tinyLogo: { width: 80, height: 80, marginRight: 10 },
  item: {
    padding: 10,
    width: "80%",
    flex: 1,
    flexWrap: "wrap",
  },
  image: {
    width: "60%",
    height: "75%",
    resizeMode: "contain",
    marginBottom: 10,
    paddingTop: 15,
    marginTop: Platform.OS === "android" ? 15 : 30,
  },
  subjectBtn: {
    // backgroundColor: "#333333",
    width: i18n.isFrench()
      ? Platform.OS === "android"
        ? "50%"
        : "55%"
      : Platform.OS === "android"
      ? "50%"
      : global.device == "2"
      ? "47%"
      : "46%",
    height:
      Platform.OS === "android" ? "9%" : global.device == "2" ? "13%" : "8%",
    borderRadius: 5,
    padding: 0,
    //  paddingTop: Platform.OS === "android" ? "0%" : "-10%",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {marginHorizontal:5,
    width: "97%",
    // borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 10, //borderWidth:1,borderColor:'red',marginBottom:0,
  },
  modalContainer: {
    height: windowHeight,
    // backgroundColor: "rgba(0,0,0,0.5)",
  },
  label: { width: "80%" },
  subjects: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    justifyContent: "space-between",
    alignItems: "center",
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
  closeIcon: {
    //paddingVertical:19
  },
  apply: {
    borderRadius: 5,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    // backgroundColor: "#26374A",
    width: "40%",
    minHeight: 25,
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
  subjectlabel: {
    marginLeft: 10,
    width: "80%",
    marginBottom: 10,
    marginVertical: 0,
  },
  subjectCheckerContainer: {
    borderWidth: 1,
    marginRight: 5,
    borderRadius: commonZoomSize("large", zoom) / 10,
    width: commonZoomSize("large", zoom),
    height: commonZoomSize("large", zoom),
    alignItems: "center",
    justifyContent: "center",
  },
  imagePotrait: { resizeMode: "contain", width: wid, height: hei },
  imageLandscape: {
    resizeMode: "contain",
    width: wid,
    height: Platform.OS == "android" ? "80%" : "85%",
    marginTop: 10,
  },
});
export default FollowingScreen;
