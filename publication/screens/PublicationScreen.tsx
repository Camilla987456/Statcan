/** @format */

import React, { useEffect, useState, useRef } from "react";
import { useClipboard } from "@react-native-community/hooks";
import {
  StyleSheet,
  BackHandler,
  Text,
  View,
  SafeAreaView,
  SectionList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  AppState,
  Appearance,
  Platform,
  RefreshControl,
  StatusBar,
  useWindowDimensions,
  ScrollView,
  Share,
} from "react-native";
// import {  Menu, Provider, Button } from "react-native-paper";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, Entypo, Feather } from "@expo/vector-icons";
import i18n from "../resources.js";
import AppLoading from "expo-app-loading";
import { adjustedDate } from "./AdjustedDate.tsx";
import {
  decodeHtmlCharCodes,
  convertDateCategory,
  checkConnection,
} from "../services";
import Constants from "expo-constants";
import {
  CommonStyles,
  commonZoomSizeFix,
  themeLiteral,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
  commonCardBackground,
  commonForegroundColor,
  commonForegroundDes,
  commonIcons,
  commonButton,
} from "../normalization.js";
import { errorMessage } from "./ErrorMessage";
import {
  toStdDateStr,
  toStdDate,
  areOnSameStdDay,
  isAfternoonByDate,
  areOnSameHalfStdDay,
  toStdDateSimple,
} from "../stdDates.js";
import { Divider } from "react-native-elements";
import { data } from "./data";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

let currentPage = 1;
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const PublicationScreen = ({ route, navigation }) => {
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  const pubRef = useRef(null);
  // let { item,idd } = route.params;
  // let id =item? route.params?.item.id:idd?idd:0;global.articleId=id;
  // let shareURL =item? item.url:null;

  const menuRef = useRef(null);
  const [count, setCount] = useState(0);
  const [name, setName] = useState(i18n.t("StatCan"));
  const [theme, setTheme] = useState(global.theme);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [readAll, setReadAll] = useState(true); /// useState(false);
  const [publicationsByCategory, setPublicationsByCategory] = useState([]); //[{category,[{id,title,date,categoryId,image,imageLabel,summary}]]

  let menuinit = [];
  for (let i = 0; i < 10000; i++) menuinit[i] = false;

  const [menu, setMenu] = useState(menuinit);
  const [offline, setOffline] = useState(false);
  const [serverDown, setServerDown] = useState(false);
  const [dataa, SetString] = useClipboard();
  let index = themeLiteral() == "light" ? 0 : 1;
  const [statusBarStyle, setStatusBarStyle] = useState(global.STYLES[index]);
  const [statusBarColor, setStatusBarColor] = useState(
    Platform.OS === "ios" ? global.COLORSIOS[index] : global.COLORS[index]
  );
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  let currentTime = new Date();
  let isMounted = false;
  React.useEffect(() => {
    navigation.addListener("focus", () => {
      global.indicator++;
      if (global.indicator > 1000) global.indicator = 0;
      global.screen = "Publication";
      console.log("publication gets focus:");
      let indicator = global.indicator;
      setCount(global.indicator);
      setName(i18n.t("StatCan"));
      setTheme(global.theme);
      if (global.publicationVersion != i18n.locale) {
        global.publicationVersion = i18n.locale; //initializeList();
      }
      initializeList();
      index = themeLiteral() == "light" ? 0 : 1;
      setStatusBarStyle(global.STYLES[index]);
      setStatusBarColor(
        Platform.OS === "ios" ? global.COLORSIOS[index] : global.COLORS[index]
      );
    });

    navigation.addListener("blur", (e) => {
      setTimeout(() => {
        console.log("publication losts focus");
      }, 1000);
    });
    initializeList();
    isMounted = true;
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const subscriptionP = AppState.addEventListener(
        "change",
        handleAppStateChange
      );
      console.log("subscription removed in Pub");
      return () => {
        if (subscriptionP) subscriptionP.remove();
        console.log("subscription removed in Pub");
      };
    }, [])
  );

  const handleAppStateChange = (nextAppState) => {
    if (!isMounted) return;
    console.log(
      "Publication detected state change:",
      global.screen,
      "sub:",
      global.subScreen,
      "State:",
      appState,
      "isMounted:",
      isMounted
    ); //if(global.screen=="Publication")navigation.navigate("HomeScreen");
    if (global.screen == "Publication") {
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
            "pub.......App has come to the foreground! scheme:",
            global.colorScheme,
            count,
            isFocused
          );
          index = themeLiteral() == "light" ? 0 : 1;
          setStatusBarStyle(global.STYLES[index]);
          setStatusBarColor(
            Platform.OS === "ios"
              ? global.COLORSIOS[index]
              : global.COLORS[index]
          );

          /*    setTimeout(() => {
                 setCount(global.indicator);setTheme(global.theme);
                   console.log('pub.......App has come to the foreground! scheme:',global.colorScheme,count,isFocused);
             }, 1000); */
        }
        appState.current = nextAppState;
      } catch (err) {
        console.log("err in publication");
        return;
      }
    }
  };

  const getPublications = async (page) => {
    let success = true;
    if (!checkConnection()) {
      setOffline(true);
      return success;
    }
    setOffline(false);
    let stamp = Date.now();
    if (page >= global.maxPage) return success;
    let url = i18n.isFrench()
      ? global.pubApiUrlBaseFr +
        `article?published_after="2021-11-09"&page=` +
        page
      : global.pubApiUrlBaseEn +
        `article?published_after="2021-11-09"&page=` +
        page;
    url += "&stamp=" + stamp;
    console.log(url, page);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json", // It can be used to overcome cors errors
          "Content-Type": "application/json",
          "Cache-Control": "no-cache,no-store,must-revalidate",
          Pragma: "no-cache",
          Expires: 0,
        },
      });
      console.log("response status", response.status);
      setServerDown(false);
      let list = [];
      const json = await response.json();
      json.map((item) =>
        list.push({
          id: item.id,
          title: decodeHtmlCharCodes(item.title),
          date: item.published_date,
          categoryId: item.subject_id,
          image: item.branding_image_src,
          imageLabel: item.branding_image_alt,
          subject: item.subject_name,
          url: item.url,
        })
      );

      if (page == 0) {
        global.publications = list;
        global.publicationPrevDatetime = new Date();
      } else {
        for (let i = 0; i < list.length; i++) {
          if (!global.publications.some((x) => x.id == list[i].id))
            global.publications.push(list[i]);
          else {
            success = false;
            global.followingsDirty = true;
          }
        }
      }

      //descending list here
      if (success) {
        global.publications.sort(function (a, b) {
          let ads = a.date;
          let inda = ads.lastIndexOf("-");
          if (!ads.endsWith("Z"))
            ads = ads.substring(0, inda) + "." + ads.substring(inda + 1) + "Z";
          let bds = b.date;
          let indb = bds.lastIndexOf("-");
          if (!bds.endsWith("Z"))
            bds = bds.substring(0, indb) + "." + bds.substring(indb + 1) + "Z";
          return new Date(bds) - new Date(ads);
        });
        setPublicationsByCategory(groupPublications(global.publications));
      }
    } catch (error) {
      console.log("error");
      setServerDown(true);
    } finally {
    }
    setLoading(false);
    return success;
  };

  const openMenu = (item, index) => {
    // if(selectedID==item){
    // setSelectedId(null);
    // }
    // else{
    //   setSelectedId(item)
    // }

    //   setSelectedId(item.id)
    //   console.log(selectedID)

    //   console.log(item.id)
    //   console.log(index)

    const newMenu = [...menu];
    newMenu[index] = !newMenu[index];
    for (let i = 0; i < newMenu.length; i++) if (index != i) newMenu[i] = false;
    setMenu(newMenu);

    // const item1 = [...publicationsByCategory];
    // let itemIndex = item1.indexOf(item);
    // // alert(itemIndex)
    // index === itemIndex ? setMenu(menu) : setMenu(!menu); // let i =0;
    //   // console.log(publicationsByCategory)
    //   // for( i =0; i<publicationsByCategory.length;i++)
    // //  console.log(publicationsByCategory)
    // if(item1.includes(index))
    // {
    //   setMenu(!menu)
    // }else{
    //   setMenu(menu)
    // }
  };
  const copyToClipboard = (item) => {
    let shareURL = item ? item.url : null;
    SetString(shareURL);
    alert("Link copied" + shareURL);
  };
  const onShare = async (item) => {
    //let text3 = `\n\nTest:\n\nstc://article/${id}\n\nhttps://www.statcan.gc.ca/o1/en/api/plus/article/${id}\n\nhttps://www.statcan.gc.ca/article/${id}\n\nhttps://www.statcan.gc.ca/mobile?id=${id}`;
    //console.log("Test....", text3);
    let shareURL = item ? item.url : null;
    let text2 = ""; // i18n.t("shareappMsg");
    Platform.OS === "android"
      ? (text2 = text2.concat(i18n.t("playstoreLink2")))
      : (text2 = text2.concat("\n", i18n.t("appstoreLink2")));
    let text = i18n.t("shareArticleMsg"); // i18n.t("sharepubMsg");
    try {
      const result = await Share.share(
        {
          title: i18n.t("sharepubMsg"),
          message: text + "\r\n" + shareURL + "\n\n" + i18n.t("app") + text2, //+text3,
          //  url:shareURL,
        },
        {
          // Android only:
          // dialogTitle: i18n.t("dialogTitle"),
          // iOS only:
          subject: i18n.t("sharepubMsg"),
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
      console.log(error.message);
      throw error;
    }
  };
  const groupPublications = (publications) => {
    if (publications.length == 0) return [];
    let current = toStdDateSimple(toStdDateStr(new Date()));
    let fistItemDate = toStdDate(publications[0].date);
    let categoryDate = fistItemDate;
    let category = i18n.t("latest");
    let groupList = [];
    let list = [];
    for (let i = 0; i < publications.length; i++) {
      let itemDate = toStdDate(publications[i].date);
      let itemDateStrRaw = publications[i].date;
      if (areOnSameStdDay(current, itemDate)) {
        if (isAfternoonByDate(current)) {
          if (isAfternoonByDate(itemDate)) {
            list.push(publications[i]);
          } else {
            if (category == i18n.t("earlierToday")) {
              list.push(publications[i]);
            } else {
              if (
                !areOnSameHalfStdDay(categoryDate, itemDate) &&
                list.length > 0
              ) {
                groupList.push({ category: category, data: list });
                categoryDate = itemDate;
                category = i18n.t("earlierToday");
                list = [];
                list.push(publications[i]);
              } else {
                list.push(publications[i]);
              }
            }
          }
        } else {
          list.push(publications[i]);
        }
      } else {
        if (areOnSameStdDay(categoryDate, itemDate)) {
          list.push(publications[i]);
        } else {
          if (list.length > 0)
            groupList.push({ category: category, data: list });
          categoryDate = itemDate;
          category = convertDateCategory(
            itemDateStrRaw.substring(0, itemDateStrRaw.indexOf("T"))
          );
          list = [];
          list.push(publications[i]);
        }
      }
    }
    if (list.length > 0) groupList.push({ category: category, data: list });
    list = [];
    return groupList;
  };

  const onLongPress = () => {
    setReadAll(true);
    navigation.navigate("NotificationList");
  };
  const initializeList = async () => {
    global.publications = [];
    currentPage = 0;
    setLoadingMore(false);
    setAllLoaded(false);
    let success = await getPublications(0);
    console.log("success in initializeList:", success);
    if (!offline && !serverDown) getNotificationsNew();
    currentPage = 1;
    if (global.subjects.length == 0 || global.notificationItems.length == 0)
      setReadAll(true);
  };
  /*   const onRefresh = () => {
    global.publications=[];
    currentPage=0;
    setAllLoaded(false);
    initializeList();
    global.publicationVersion=i18n.locale;
    setReadAll(!global.notifications.some(x=>x.readFlag===false));
  }; */
  const loadMoreResults = async (info) => {
    if (loadingMore || allLoaded) return;
    // console.log("load page:", currentPage, loadingMore, allLoaded);
    setLoadingMore(true);
    let success = await getPublications(currentPage);
    console.log("success in loadMore:", success, "page:", currentPage);
    if (success) {
      setTimeout(() => {
        setLoadingMore(false);
        currentPage = currentPage + 1;
        if (currentPage >= global.maxPage) setAllLoaded(true); //Test
      }, 1000);
    } else {
      setLoadingMore(false);
      if (pubRef != null && pubRef.current != null)
        pubRef.current.scrollToLocation({
          sectionIndex: 0,
          viewPosition: 0,
          itemIndex: 0,
          viewOffset: 0,
          animated: false,
        });
      let curr = new Date();
      var diffSec = parseInt((curr - currentTime) / 1000, 10);
      console.log("interval:..........", diffSec);
      if (diffSec > 600) initializeList(); //>10 minutes
      currentTime = new Date();
    }
  };
  /*  const onTest=()=>{console.log('gggggg',pubRef.current);
      if (pubRef != null && pubRef.current != null)
                     pubRef.current.scrollToLocation({
                       sectionIndex: 0,
                       viewPosition: 0,
                       itemIndex: 0,
                       viewOffset: 0,
                       animated: false,
                     });
  } */
  const h = 3;
  let w = windowWidth - 20;
  const bellWidth = global.device == "2" ? 40 : 30;
  const alertWidth = bellWidth / 3;

  async function getNotificationsNew() {
    if (!checkConnection()) {
      setOffline(true);
      return;
    }
    setOffline(false);

    if (global.subjects.length == 0) return;
    let url = global.pubApiUrlBaseEn + "notifications";

    let theDay = new Date();
    const today = `${theDay.getFullYear()}-${
      theDay.getMonth() + 1
    }-${theDay.getDate()}`;
    let data = [];

    global.subjects.forEach(function (x) {
      //    console.log(global.subjects);
      //  x.date='2021-11-01';
      if (x.date != null)
        data.push({ subject_id: x.key, published_date: x.date });
      else data.push({ subject_id: x.key, published_date: "2020-12-01" }); //shouldn't come here
    });

    let list1 = global.notificationItems;
    let list2t = await getNotificationList(url, data);
    //  console.log("notification new list count=", list2t);
    let list2 = [];
    list2t.map((x) => {
      if (global.subjects.some((y) => y.key == x.subject_id)) {
        list2.push({
          id: x.id,
          title_en: x.title_en,
          title_fr: x.title_fr,
          published_date: x.published_date,
          subject_id: x.subject_id,
          readFlag: false,
        });
      }
    }); //console.log('new Noti list:',list2);
    // global.notificationReadAll = list2t.some((x) =>list1.some((y) => y.id == x.id));   //Old way
    if (global.notificationReadAll)
      global.notificationReadAll = checkNewList(list2, list1);
    setReadAll(global.notificationReadAll);
    AsyncStorage.setItem("ReadAll", global.notificationReadAll.toString());
    let list3 = [];

    //new way
    list2.forEach(function (x) {
      if (global.subjects.some((y) => y.key == x.subject_id)) {
        let f1 = list1.find((z) => z.id == x.id);
        if (f1) list3.push(f1);
        else list3.push(x);
      }
    });
    list1.forEach(function (x) {
      if (global.subjects.some((y) => y.key == x.subject_id)) {
        let f3 = list3.find((z) => z.id == x.id);
        if (!f3) list3.push(x);
      }
    });
    list3 = list3.slice(0, global.maxNotificationArticle);

    global.notificationItems = list3; //console.log('noti list',list3);

    global.subjects.forEach(function (x) {
      x.date = today;
    });
    AsyncStorage.setItem("Subjects", JSON.stringify(global.subjects));
    console.log(
      "notification list to be saved:",
      global.notificationItems.length
    );
    global.afterGet = true;
    try {
      AsyncStorage.setItem("Notifications", JSON.stringify(list3));
    } catch (err) {
      console.log("saving notification list:", err);
    }
  }

  function checkNewList(listN, listO) {
    let r = true;
    if (listN.length == 0) return true;
    else {
      if (listO.length == 0) return false;
      else {
        listN.forEach(function (x) {
          if (!listO.some((y) => y.id == x.id)) {
            r = false;
          }
        });
      }
    }
    return r;
  }
  async function getNotificationList(url, data) {
    let notifications = [];
    console.log("retrieving new notification...");
    //  console.log(url, data);
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        notifications = result;
        setServerDown(false);
        return notifications;
      })
      .catch((error) => {
        console.log("Error");
        setServerDown(true);
        console.warn(error);
        return notifications;
      });
  }
  const onRetry = () => {
    setOffline(false);
    global.publications = [];
    currentPage = 0;
    initializeList();
    global.publicationVersion = i18n.locale;
    if (global.subjects.length == 0 || global.notificationItems.length == 0)
      setReadAll(true);
  };
  const [selectedID, setSelectedId] = React.useState(null);

  //  console.log("list count before render:", global.publications);

  // const openMenu = () => setVisible(true);

  // const closeMenu = () => setVisible(false);
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
            commonCardBackground(theme),
            CommonStyles.tabHeaderContainer,
            styles.header,
          ]}
        >
          {loading && !offline && !serverDown && (
            <ActivityIndicator
              size="large"
              color={themeLiteral() == "light" ? "black" : "white"}
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                zIndex: 20,
              }}
            />
          )}
        </View>

        {(offline || serverDown) && errorMessage(offline, onRetry, 0, name)}
        <View>
          <View
            style={[
              {
                justifyContent: "center",
                height: "6%",
                width: "100%",
                zIndex: 1,
                position: "absolute",
                top:
                  Platform.OS === "android"
                    ? global.device == "1"
                      ? "7%"
                      : "7%"
                    : "7%",
                left: "0%",
                shadowOffset: {
                  width: 1,

                  height: 3,
                },
              },
            ]}
          >
            {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  flexDirection: "row",
                  alignContent: "center",
                }}
                accessibilityRole="button"
                accessible={true}
                onPress={() => {
                  pubRef.current.scrollToLocation({
                    sectionIndex: 0,
                    viewPosition: 0,
                    itemIndex: 0,
                    viewOffset: 0,
                    animated: true,
                  });
                }}
              >
                <Text
                  style={[
                    commonButton(theme),
                    {
                      padding: 9,
                      textAlign: "center",
                      fontSize: 18,
                      height: 45,
                      // backgroundColor: "#335075",
                      // borderColor: "#92A8C14D",
                      color: "white",
                      borderWidth: 1,
                      borderRadius: 2,
                    },
                  ]}
                >
                  {i18n.t("scrollToTop")}
                  <Feather
                    name="chevron-up"
                    size={16}
                    style={{ color: "white" }}
                  />
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {publicationsByCategory.length > 0 && (
            <SectionList
              ref={pubRef}
              sections={publicationsByCategory}
              keyExtractor={(item, index) => item.title + index}
              removeClippedSubviews={false}
              onScroll={(event) => {
                setContentVerticalOffset(event.nativeEvent.contentOffset.y);
              }}
              renderItem={({ item, index, section }) => {
                return (
                  <View
                    style={[
                      commonCardBackground(theme),
                      CommonStyles.cardContainer,
                      { marginHorizontal: "5%" },
                    ]}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => {
                        global.prevNavigateRoute = "Main";
                        global.articleId = item.id;
                        navigation.navigate("DisplayArticle", { item: item });
                      }}
                    >
                      {index == 0 ? (
                        <View style={CommonStyles.cardViewBig}>
                          {item.image != "" && (
                            <Image
                              source={{ uri: item.image }}
                              style={[
                                CommonStyles.cardImageBig,
                                { height: windowHeight / h },
                              ]}
                            />
                          )}
                          <View style={{ padding: 10 }}>
                            <Text
                              style={[
                                commonForeground(theme),
                                CommonZoomStyle("small", { zoom }),
                                { fontWeight: "bold" },
                              ]}
                              numberOfLines={4}
                              ellipsizeMode="tail"
                            >
                              {item.title}
                            </Text>
                          </View>
                        </View>
                      ) : (
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
                          </View>
                          {item.image != "" && (
                            <Image
                              style={{ width: "28%", height: "100%" }}
                              source={{ uri: item.image }}
                            />
                          )}
                        </View>
                      )}
                    </TouchableWithoutFeedback>
                    <Divider />
                    <View
                      style={{
                        paddingLeft: 7,
                        height: 50,
                        flexDirection: "row",
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "space-between",
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
                        {item.subject}
                      </Text>
                      <TouchableOpacity
                        ref={menuRef}
                        tabIndex="4"
                        style={[
                          { marginRight: 5 },
                          CommonStyles.tapSpot,
                          isLandscapeMode
                            ? global.device == "2"
                              ? styles.headerItemIpad
                              : styles.headerItem
                            : styles.headerItem,
                        ]}
                        accessibilityRole="button"
                        accessible={true}
                        onPress={() => {
                          openMenu(item, index);
                        }}
                        accessibilityLabel={i18n.t("dropdownMenu")}
                      >
                        <Feather
                          name="more-horizontal"
                          size={global.device == "2" ? 50 : 24}
                          style={[commonForegroundDes(theme)]}
                        />
                      </TouchableOpacity>
                      {/* <MenuProvider >
                        <Menu style={{flexDirection:'row-reverse',paddingTop:7}}>
                          <MenuTrigger>
                            <Entypo
                              name="dots-three-horizontal"
                              size={16}
                              color="black"
                            />
                          </MenuTrigger>
                          <MenuOptions > */}
                      {/* <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            style={{ height: 200 }}
            renderItem={({ item }) => (
              <MenuOption
                onSelect={() => alert(item.name)}
                customStyles={{
                  optionWrapper: {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  },
                }}
              >
                <Text>{item.name}</Text>
                <Text>{item.icon}</Text>
              </MenuOption>
            )}
          /> */}

                      {/* </MenuOptions >
          <MenuOption >
         <Text>share this pub</Text>
         <Text>copy to clipboard</Text>
          </MenuOption>
                        </Menu>
                      </MenuProvider> 
                 */}
                    </View>

                    {menu[index] && (
                      <View
                        style={[
                          {
                            width: "80%",
                            alignSelf: "flex-end",
                            padding: 10,
                            borderRadius: 8,
                            marginRight: 8,
                            shadowOffset: { width: 3, height: 3 },
                            shadowOpacity: 1, // IOS
                            shadowRadius: 3, //IOS
                            shadowColor:
                              Platform.OS == "android" ? "" : "#92A8C14D", // IOS
                            elevation: global.device == "2" ? 24 : 12,
                            marginTop: isLandscapeMode
                              ? Platform.OS == "android"
                                ? "3%"
                                : "0%"
                              : 0,
                          },
                          commonCardBackground(theme),
                        ]}
                      >
                        <TouchableOpacity
                          accessibilityRole="button"
                          accessible={true}
                          onPress={() => {
                             onShare(item);
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={[
                                i18n.isFrench()
                                  ? CommonZoomStyle("mini2", { zoom })
                                  : CommonZoomStyle("small", { zoom }),
                                {
                                  textAlign: "center",
                                  marginLeft: 12,
                                  marginRight: 8,
                                  paddingTop: 6,
                                },
                                commonForegroundDes(theme),
                              ]}
                            >
                              {i18n.t("sharethisapp")}
                            </Text>
                            <Ionicons
                              name="share-social"
                              size={global.device == "2" ? 50 : 18}
                              style={[{}, commonForeground(theme)]}
                            />
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            borderWidth: global.device == "2" ? 2 : 1,
                            borderColor: "#CCD1D7",
                            marginVertical: 2,
                          }}
                        ></View>
                        <TouchableOpacity
                          accessibilityRole="button"
                          accessible={true}
                          onPress={() => {
                            copyToClipboard(item);
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={[
                                i18n.isFrench()
                                  ? CommonZoomStyle("mini2", { zoom })
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
                              {"Copy to Clipboard"}
                            </Text>
                            <Feather
                              name="user"
                              size={global.device == "2" ? 50 : 18}
                              style={[{}, commonForeground(theme)]}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              }}
              stickySectionHeadersEnabled={false}
              refreshControl={
                <RefreshControl
                  //refresh control used for the Pull to Refresh
                  refreshing={refreshing}
                  onRefresh={initializeList}
                  tintColor={themeLiteral() == "light" ? "black" : "white"}
                />
              }
              renderSectionHeader={({ section: { category } }) =>
                adjustedDate(category, zoom, theme, true)
              }
              ListFooterComponent={
                <View style={styles.footer}>
                  {loadingMore && (
                    <ActivityIndicator
                      size="large"
                      color={themeLiteral() == "light" ? "black" : "white"}
                      style={{ bottom: 40, zIndex: 20 }}
                    />
                  )}
                </View>
              }
              scrollEventThrottle={250}
              onEndReached={(info) => {
                loadMoreResults(info);
              }}
              onEndReachedThreshold={0.1}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  /*   title: {
    paddingVertical: 10,
    marginLeft:
      Platform.OS === "android"
        ? global.device == "2"
          ? "-8%"
          : "-10%"
        : "-3%",
    marginRight: Platform.OS === "android" ? "2%" : "6%",
    fontWeight: "bold",
    borderRadius: 10,
  }, */
  subjectName: {
    //No use
    paddingVertical: 10,
    paddingLeft: Platform.OS === "android" ? "0%" : "0%",
    marginVertical: -15,
    marginLeft: Platform.OS === "android" ? "-9%" : "-4%",
    marginRight: Platform.OS === "android" ? "2%" : "0%",
    marginBottom: 4,
    marginTop: "-5%",
  },
  category: {
    fontWeight: "bold",
    paddingHorizontal: global.device == "2" ? 60 : 26,
    paddingTop: Platform.OS === "android" ? 0 : -10,
    paddingBottom: Platform.OS === "android" ? 0 : 10,
    marginBottom: Platform.OS === "android" ? 10 : 10,
    marginTop: 10,
  },
  date: { fontWeight: "bold" },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIpad: {
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
  container: {
    flex: 1,
    marginVertical: 200,
    marginHorizontal: 100,
  },
  scroll: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default PublicationScreen;

///////
