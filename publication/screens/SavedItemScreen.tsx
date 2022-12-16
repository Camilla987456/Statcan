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
  ActivityIndicator,
  Alert,
  Platform,
  AppState,
  Appearance,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { adjustedDate } from "./AdjustedDate.tsx";
import {
  CommonStyles,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
  commonFrameBackground,
  commonBorder,
  commonForegroundHighlightColor,
  commonCardBackground,
  themeLiteral,
  commonButton,
  commonForegroundDes,
} from "../normalization.js";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { arrayGroupBy, convertDateCategory } from "../services";
import { fetchArticleMockup } from "../servicesMockup";
import "../settings.js";
import i18n from "../resources.js";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const SavedItemScreen = ({ navigation }) => {
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [theme, setTheme] = useState(global.theme);
  const [count, setCount] = useState(0);
  const [name, setName] = useState(i18n.t("name"));
  const [home, setHome] = useState(i18n.t("returnToPublication"));
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchDone, setFetchDone] = useState(false);
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  let indicator = 0;
  console.log("indicator global:" + global.indicator);
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();

  React.useEffect(() => {
    navigation.addListener("focus", async () => {
      global.indicator++;
      global.screen = "Favorite";
      global.subScreen = "SavedItems";
      console.log("SavedItem get focused", global.screen, global.subScreen);
      indicator = global.indicator;
      setCount(global.indicator);
      setZoom(global.zoom);
      setBold(global.bold);
      setTheme(global.theme);
      setName(i18n.t("savedItems"));
      setHome(i18n.t("returnToPublication"));
      let l = await getSavedItemList();
      setList(l);
      setFetchDone(true);
    });
    navigation.addListener("blur", () => setFetchDone(false));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const subscriptionFs = AppState.addEventListener(
        "change",
        handleAppStateChangeFs
      );
      console.log("subscription removed in SavedItems");
      return () => {
        if (subscriptionFs) subscriptionFs.remove();
        console.log("subscription removed in SavedItems");
      };
    }, [])
  );
  const handleAppStateChangeFs = (nextAppState) => {
    console.log(
      "SavedItems detected state change come here:",
      global.screen,
      "subScreen:",
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
            "Following.......App has come to the foreground! scheme:",
            global.colorScheme,
            count,
            commonBackground(theme)
          );
        }
        appState.current = nextAppState;
      } catch (err) {
        console.log("err in SavedItem");
        return;
      }
    }
  };

  const getSavedItemList = async () => {
    setLoading(true);
    let items = [];
    let savedItems = global.savedItems; // [];
    console.log("saved:", savedItems, global.savedItems);
    if (savedItems.length == 0) return items;
    for (let i = 0; i < savedItems.length; i++) {
      let itemId = savedItems[i];
      console.log("Have to get from api");
      let fa = await getArticle(itemId);
      let dd = convertDateCategory(
        fa.published_date.substring(0, fa.published_date.indexOf("T"))
      );
      items.push({
        id: fa.id,
        title: fa.title,
        image: fa.branding_image_src,
        imageLabel: fa.branding_image_alt,
        category: fa.subject_name,
        date: dd,
      });
    }
    setLoading(false);
    return items;
  };
  const getArticle = async (id) => {
    //   setLoading(true);
    let url = i18n.isFrench()
      ? global.pubApiUrlBaseFr + `article/${id}`
      : global.pubApiUrlBaseEn + `article/${id}`;
    console.log(url);
    return fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        //     setLoading(false);
        return result;
      })
      .catch((error) => {
        console.warn(error);
        //     setLoading(false);
        return null;
      });
  };

  const onUnsave = (itemId) => {
    Alert.alert(
      i18n.t("unSaveItems"),
      i18n.t("unSaveConfirm"),
      [
        {
          text: i18n.t("unSave"),
          onPress: () => {
            onContinue(itemId);
          },
        },
        { text: i18n.t("Cancel"), onPress: () => {} },
      ],
      { cancelable: false }
    );
  };
  const onContinue = (itemId) => {
    global.savedItems = global.savedItems.filter((item) => item !== itemId);
    AsyncStorage.setItem("SavedItems", JSON.stringify(global.savedItems));
    let l = list.filter((item) => item.id !== itemId);
    setList(l);
    /* if (i18n.isFrench()) {
      global.savedItemsF = global.savedItemsF.filter((item) => item !== itemId);
      AsyncStorage.setItem("SavedItemsF", JSON.stringify(global.savedItemsF));
      let l = list.filter((item) => item.id !== itemId);
      setList(l);
    } else {
      global.savedItemsE = global.savedItemsE.filter((item) => item !== itemId);
      AsyncStorage.setItem("SavedItemsE", JSON.stringify(global.savedItemsE));
      let l = list.filter((item) => item.id !== itemId);
      setList(l);
    } */
  };
  const onReturnPress = () => {
    navigation.navigate("HomeTab");
  };
  const deleteItem = (item) => {
    global.savedItems = global.savedItems.filter((x) => x !== item.id);
    setList(getSavedItemList());
    /* if (i18n.isFrench()) {
      global.savedItemsF = global.savedItemsF.filter((x) => x !== item.id);
      setList(getSavedItemList());
    } else {
      global.savedItemsE = global.savedItemsE.filter((x) => x !== item.id);
      setList(getSavedItemList());
    } */
  };
  return (
    <SafeAreaView
      style={[
        CommonStyles.safeArea,
        commonBackground(theme),
        { marginTop: Platform.OS == "android" ? 0 : 0 },
      ]}
    >
     <View style={[commonBackground(theme),CommonStyles.tabHeaderContainer,{marginBottom:5}]} onPress={() => {Keyboard.dismiss();setShowSorter(false);}}>
            <Text style={[ CommonZoomStyle("medium", { zoom }), commonFontWeight({ bold }), commonForegroundDes(theme), CommonStyles.tabHeaderTitle ]} accessibilityRole="header" accessible={true}>
              {i18n.t("savedItems")}
            </Text>
          </View>
      {list.length == 0 &&fetchDone? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            paddingVertical:
              Platform.OS === "android"
                ? "10%"
                : global.device == "2"
                ? "5%"
                : "10%",
            paddingBottom: Platform.OS === "android" ? 15 : 30,
          }}
        >
          <Text
            style={[
              isLandscapeMode
                ? global.device == "2"
                  ? styles.titleLandscapeIpad
                  : styles.titleLandscape
                : styles.titlePotrait,
              commonForeground(theme),
              i18n.isFrench()
                ? CommonZoomStyle("mini", { zoom })
                : CommonZoomStyle("small", { zoom }),
            ]}
          >
            {i18n.t("savedScreenMsg")}
          </Text>
          <View
            style={[commonButton(theme),
             
              isLandscapeMode
                ? global.device == "2"
                  ? styles.subjectBtnLandscapeIpad
                  : styles.subjectBtnLandscape
                : styles.subjectBtn
          ]  }
          >
            <TouchableOpacity
              onPress={onReturnPress}
              style={[{ flexDirection: "row" }]}
            >
              <Text
                style={[ 
                  {
                   color: "#FFFFFF",
                    alignSelf: "center",
                    textAlign: "center",
                  },
                  i18n.isFrench()
                    ? Platform.OS == "android"
                      ? CommonZoomStyle("mini", { zoom })
                      : CommonZoomStyle("small", { zoom })
                    : CommonZoomStyle("small", { zoom }),
                ]}
              >
                {home}
              </Text>
            </TouchableOpacity>
          </View>

          <Image
            style={
              isLandscapeMode
                ? global.device == "2"
                  ? styles.imageLandscapeIpad
                  : styles.imageLandscape
                : styles.image
            }
            source={require("../assets/Saved-1.png")}
          />
        </View>
      ) : (
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: Platform.OS === "android" ? 0 : 20,
          }}
        >
          {loading && (
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
          <FlatList
            style={{ width: "100%" }}
            data={list}
            renderItem={({ item, index }) => (
              <View
                style={[
                  commonCardBackground(theme),
                  CommonStyles.cardContainer,
                  { marginHorizontal: "2%" },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    global.prevNavigateRoute = "SavedItem";
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
                        {item.title}
                      </Text>
                      <Text
                        style={[
                          CommonZoomStyle("small", { zoom }),
                          commonForeground(theme),
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.category}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={[
                            CommonZoomStyle("mini", { zoom }),
                            commonForeground(theme),
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {adjustedDate(item.date, zoom, theme, false)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => onUnsave(item.id)}
                          style={CommonStyles.tapSpot}
                          onStartShouldSetResponder={(e) => true}
                          accessible={true}
                          accessibleRole="button"
                          accessibilityLabel={i18n.t("saveItem")}
                        >
                          <View
                            style={{
                              alignItems: "center",
                              height: 40,
                              marginLeft: -20,
                            }}
                          >
                            <FontAwesome
                              name="circle"
                              size={40}
                              color={
                                themeLiteral() == "light"
                                  ? "#F4F7FA"
                                  : "#5b6b83"
                              }
                              style={{ position: "relative", top: 0, left: 0 }}
                            />
                            <Ionicons
                              name="heart-sharp"
                              size={25}
                              color={
                                themeLiteral() == "light"
                                  ? "#333333"
                                  : "#17B8FC"
                              }
                              style={{
                                position: "relative",
                                top: -30,
                                left: 0,
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Image
                      style={{ width: "28%", height: "100%" }}
                      source={{ uri: item.image }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  titleLandscape: {
    textAlign: "left",
    marginBottom: 16,
    marginTop: "-8%",
  },
  titleLandscapeIpad: {
    textAlign: "left",
    marginBottom: 16,
    marginTop: "-5%",
  },
  titlePotrait: {
    textAlign: "left",
    marginBottom: 16,
    marginTop: "-10%",
  },
  container: { flex: 1, padding: 16, width: "94%", alignSelf: "center" },
  itemContainer: {
    padding: 10,
    flexDirection: "column",
    width: global.device == "2" ? "85%" : "77%",
    marginTop: Platform.OS === "android" ? (i18n.isFrench() ? 55 : 35) : 40,
  },
  item: {
    width: "100%",
    flexWrap: "wrap",
    paddingVertical: global.device == "2" ? 11 : 15,
    fontWeight: "bold",
  },
  imageContainer: {
    width: "28%",
    padding: 5,
  },
  tinyLogo: {
    width: "28%",
    height: "100%",
  },
  image: {
    width: "105%",
    height: "75%",
    resizeMode: "contain",
    marginBottom: 10,
    paddingTop: 15,
    marginTop: "1%",
  },
  imageLandscape: {
    width: "105%",
    height: "105%",
    resizeMode: "contain",
    paddingTop: 15,
    marginTop: "1%",
  },
  imageLandscapeIpad: {
    width: "105%",
    height: "80%",
    resizeMode: "contain",
    marginTop: "2%",
  },
  card: {
    //No use
    borderWidth: 0,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 10,
    marginLeft: "2%",
    marginTop: "2%",
  },
  subjectBtn: {
    // backgroundColor: "#333333",
    width: i18n.isFrench()
      ? Platform.OS === "android"
        ? "50%"
        : "78%"
      : Platform.OS === "android"
      ? "65%"
      : global.device == "2"
      ? "47%"
      : "55%",
    height:
      Platform.OS === "android" ? "9%" : global.device == "2" ? "13%" : "8%",
    borderRadius: 5,
    padding: 0,
    paddingTop: Platform.OS === "android" ? "0%" : "-10%",
    justifyContent: "center",
    alignItems: "center",
  },
  subjectBtnLandscape: {
    // backgroundColor: "#333333",
    width: i18n.isFrench()
      ? Platform.OS === "android"
        ? "50%"
        : "78%"
      : Platform.OS === "android"
      ? "65%"
      : global.device == "2"
      ? "47%"
      : "55%",
    height:
      Platform.OS === "android" ? "25%" : global.device == "2" ? "13%" : "25%",
    borderRadius: 5,
    padding: 0,
    paddingTop: Platform.OS === "android" ? "0%" : "-10%",
    justifyContent: "center",
    alignItems: "center",
  },
  subjectBtnLandscapeIpad: {
    // backgroundColor: "#333333",
    width: i18n.isFrench()
      ? Platform.OS === "android"
        ? "50%"
        : "78%"
      : Platform.OS === "android"
      ? "65%"
      : global.device == "2"
      ? "47%"
      : "55%",
    height:
      Platform.OS === "android" ? "25%" : global.device == "2" ? "10%" : "25%",
    borderRadius: 5,
    padding: 0,
    paddingTop: Platform.OS === "android" ? "0%" : "-10%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },
});

export default SavedItemScreen;
