/** @format */

import React, { useEffect, useState,useRef } from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,AppState,Appearance,
  Alert,Dimensions,
  useWindowDimensions
} from "react-native";
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, FontAwesome5, Feather } from "@expo/vector-icons";
import "../settings.js";
import {adjustedDate} from "./AdjustedDate.tsx";
import i18n from "../resources.js";
import {
  CommonStyles,commonZoomSizeFix,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonMenuBackground,
  commonForeground,
  commonFrameBackground,
  commonBorder,
  commonForegroundHighlightColor,
  commonCardBackground,
  commonForegroundDes,
  themeLiteral,
} from "../normalization.js";

import {
  checkNotificationAvailability,
  checkConnection,
  decodeHtmlCharCodes,
  convertDateCategory,
} from "../services";
import { useRoute } from "@react-navigation/native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
let currentPage = 0;

const FollowingListScreen = ({ route, navigation }) => {
  // const route = useRoute();
  const {items} = route.params;
  console.log(items);
  global.followingList=items;
  console.log("lable length",items.length);
  let label = "";
  let labelId = 0;

  if (items.length > 0) {
    label = items[0].category;
    labelId = items[0].categoryId;
  }
 
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  console.log(labelId, label);
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [count, setCount] = useState(0);
  const [name, setName] = useState(i18n.t("following"));
  const [list, setList] = useState(items);
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState(global.theme);
  const [toast, setToast] = useState(false);
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;
  const [toastMsg, setToastMsg] = useState(i18n.t("subjectUnfollowed"));

  const [offline, setOffline] = useState(false);
  const [serverDown, setServerDown] = useState(false);
// const route = useRoute();
  let indicator = 0;let lh=Math.max(8*commonZoomSize("small",zoom),windowWidth*0.94*0.3);console.log('sssss:',lh);
  console.log("indicator global in Favorite:" + global.indicator);
const appState = useRef(AppState.currentState);const isFocused = useIsFocused();
  React.useEffect(
    () =>
      navigation.addListener("focus", () => {
        global.indicator++;
        console.log("following list gets focused");
        indicator = global.indicator;global.screen="FollowingList";
        setCount(global.indicator);
        setZoom(global.zoom);
        setBold(global.bold); setTheme(global.theme);
        setName(i18n.t("following"));
        currentPage = 0;
        if (list.length >= 10) currentPage = 1;
      }),
    []
  );

     useFocusEffect(
          React.useCallback(() => {
            const subscriptionFl = AppState.addEventListener("change", handleAppStateChangeFl);console.log('subscription removed in FollowingList');
                return () =>{if(subscriptionFl)subscriptionFl.remove();console.log('subscription removed in FollowingList'); }
          }, [])
        );
  const handleAppStateChangeFl = nextAppState => {
     console.log('FollowingList detected state change come here:',global.screen,'subScreen:',global.subscreen,'State:',appState);
     if(global.screen.includes("FollowingList")){
        try{
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
              global.colorScheme = Appearance.getColorScheme();global.indicator++;setCount(global.indicator);setTheme(global.theme);
              console.log('FollowingList.......App has come to the foreground! scheme:',global.colorScheme,count,commonBackground(theme));
            }
            appState.current = nextAppState;
         }catch(err){console.log('err in FollowingList');return;}
      }
  }

  // Unsave the publication
  const onUnsave = (itemId) => {
    Alert.alert(
      i18n.t("unFollowSubject"),
      i18n.t("unFollowConfirm") + " " + label + "?",

      [
        {
          text: i18n.t("unFollow"),
          onPress: () => {
            onContinue(itemId);
          },
          style: "destructive" ,
        },
        {
          text: i18n.t("Cancel"),
          onPress: () => {
            setMenu(false);
          },
        },
      ],
      { cancelable: false }
    );
  };

  // To remove item from list and save it to AsyncStorage and update the list
  const onContinue = (itemId) => {
    setToast(true);
    setMenu(false);
    setTimeout(() => {
      global.subjectItems = global.subjectItems.map((x) =>
        x.key == labelId ? { ...x, value: false } : x
      );
      /*       let f= global.subjectItems.find(x=>x.key==labelId);if(f!=null)f.value=false; */

      global.followingsDirty = true;
      global.subjects = global.subjectItems
        .filter((s) => s.value)
        .map(function (e) {
          return { key: e.key, value: e.value };
        });
      AsyncStorage.setItem("Subjects", JSON.stringify(global.subjects));
      global.notificationReadAll = checkNotificationAvailability();
      setToast(false);
      navigation.navigate("Following");
    }, 2000);
  };

  const onRetry = () => {
    console.log("retry");
    setOffline(false);
    setServerDown(false);
    loadMoreResults();
  };

  const loadMoreResults = async (info) => {
    console.log("loading more.......", currentPage, loadingMore, allLoaded);
    if (loadingMore || allLoaded) return;
    console.log("load page:", currentPage, loadingMore, allLoaded);
    setLoadingMore(true);
    getFollowings();

    /* setTimeout(() => {
      setLoadingMore(false);
      currentPage = currentPage + 1;
      if (currentPage >= global.maxPage) setAllLoaded(true); //Test
    }, 1000); */
  };

  const getFollowings = async () => {
    if (!checkConnection()) {
      setOffline(true);
      return;
    }
    setOffline(false);

    if (currentPage >= global.maxPage) return;
    let url = i18n.isFrench()
      ? global.pubApiUrlBaseFr +
        "following?subject_id=" +
        labelId +
        "&page=" +
        currentPage
      : global.pubApiUrlBaseEn +
        "following?subject_id=" +
        labelId +
        "&page=" +
        currentPage;
    console.log("Get following url:", url);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*", // It can be used to overcome cors errors
          "Content-Type": "application/json",
        },
      });
      console.log("response status", response.status);
      let list1 = list;
      const json = await response.json();
      setServerDown(false);
      if (json.length == 0) {
        setAllLoaded(true);
        setLoadingMore(false);
        return;
      }
      json.map((item) => {
        if (!list1.some((x) => x.id == item.id)) {
          list1.push({
            id: item.id,
            title: item.title ? decodeHtmlCharCodes(item.title) : "",
            date: item.published_date,
            categoryId: item.subject_id,
            image: item.branding_image_src,
            imageLabel: item.branding_image_alt,
            subject: item.subject_name,
          });
        }
      });
      setList(list1);
    } catch (error) {
      console.log("error");
      setServerDown(true);
    } finally {
      setLoadingMore(false);
    }
    currentPage = currentPage + 1;
    if (currentPage >= global.maxPage) setAllLoaded(true);
  };
//const onLayout=(event)=>{setLh(event.nativeEvent.layout.height);console.log('hhhhhh',lh);}


  return (
    <SafeAreaView style={[CommonStyles.safeArea, commonBackground(theme)]}>
      <View
        style={[
          {
            flexDirection: "row",
            marginTop: 10,
            alignItems: "center",
            marginBottom: 20,
            borderWidth: 1,
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            elevation: 0,
            borderColor: "#CCD1D7",
          },
          commonCardBackground(theme),
        ]}
      >
        <TouchableOpacity
          style={{}}
          accessibilityRole="button"
          accessible={true}
          onPress={() => {
          //  navigation.navigate("Main");
          navigation.navigate('Main', {
            screen: 'HomeTab',
            params: {
              screen: 'FollowingStack',
              params: {
                screen: 'Following',
              },
            },
          });
          }}
          accessibilityLabel={i18n.t("goBack")}
        >
          <Feather
            name="chevron-left"
            size={global.device == "2" ? 50 : 24}
            style={[
              commonForeground(theme),
              {
                paddingHorizontal: "4%",
                marginTop: 10,
                marginBottom: 10,
              },
            ]}
          />
        </TouchableOpacity>
        <Text
          style={[
            CommonZoomStyle("small", { zoom }),
            commonFontWeight({ bold }),
            commonForeground(theme),
            { flex: 1, textAlign: "center", marginRight: "8%" },
          ]}
        >
          {label}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessible={true}
          onPress={() => setMenu(!menu)}
        >
          <Feather
            name="more-horizontal"
            size={global.device == "2" ? 50 : 24}
            style={[commonForeground(theme), { marginHorizontal: 10 }]}
          />
        </TouchableOpacity>
      </View>
      {menu && (
        <View
          style={[
            {
              alignSelf: "flex-end",
              zIndex: 200,
              borderWidth: 1,
              elevation: 10, // Android,
              borderColor: "#92A8C14D",

              borderRadius: 8,
              position: "absolute",
              top:
                global.device == "2"
                  ? Platform.OS == "android"
                    ? "7.5%"
                    : "9%"
                  : Platform.OS == "android"
                  ? "7.5%"
                  : "12%",
              right: "0%",
              left: "13%",

              padding: 20,
              paddingTop: 0,
              paddingBottom: 0,
              width: "80%",
              shadowOffset: {
                width: 3,
                height: 3,
              },
              shadowOpacity: 1, // IOS
              shadowRadius: 3, //IOS
              shadowColor: "#92A8C14D", // IOS
            },
            commonMenuBackground(theme),
          ]}
        >
          <TouchableOpacity
            style={{ marginRight: 0 }}
            accessibilityRole="button"
            accessible={true}
            onPress={() => onUnsave(labelId)}
            accessibilityLabel={i18n.t("unfollow")}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginLeft: "3%",
                marginRight: "3%",
                marginTop: "-5%",
                marginBottom: "1%",
                padding: 5,
              }}
            >
              <Text
                style={[
                  {
                    fontSize:
                      global.device == "2" ? 20 : i18n.isFrench() ? 11.5 : 14,
                    paddingTop: Platform.OS === "android" ? "7%" : "5%",
                    textAlign: "left",
                    marginTop: isLandscapeMode
                      ? Platform.OS == "android"
                        ? 0
                        : 5
                      : 0,
                  },
                  commonForeground(theme),
                ]}
              >
                {i18n.t("unfollow") + " "}
                {label}
              </Text>
              <Feather
                name="x"
                size={global.device == "2" ? 25 : 18}
                style={[
                  {
                    marginTop: isLandscapeMode
                      ? Platform.OS == "android"
                        ? "7%"
                        : "5.6%"
                      : Platform.OS === "android"
                      ? i18n.isFrench()
                        ? 16
                        : global.device == "2"
                        ? 40
                        : 18
                      : global.device == "2"
                      ? 35
                      : 13,
                  },
                  commonForeground(theme),
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
      )}
      {(offline || serverDown) && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Text
            style={[
              styles.titleErr,
              CommonZoomStyle("small", { zoom }),
              commonForeground(theme),
              { marginLeft: 20 },
            ]}
          >
            {offline
              ? i18n.t("offLine")
              : i18n.t("serverDown").replace("(Screen-name)", name)}
          </Text>
          <View style={styles.retryBtn}>
            <TouchableOpacity onPress={onRetry}>
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
                {i18n.t("retry")}
              </Text>
            </TouchableOpacity>
          </View>
          <Image
            style={styles.image}
            source={require("../assets/Link-broken.png")}
          />
        </View>
      )}

      <FlatList
        style={{ width: "100%", paddingHorizontal: "3%" }}
        data={list}
        scrollEventThrottle={250}
        onEndReached={(info) => {
          loadMoreResults(info);
        }}
        onEndReachedThreshold={0.1}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item, index }) => (
          <View
            id={index}
            style={[
              commonCardBackground(theme),
              CommonStyles.cardContainer,
              { marginHorizontal: 8 },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                global.prevNavigateRoute = "FollowingList";
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
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {adjustedDate(
                      convertDateCategory(item.date),
                      zoom,
                      theme,
                      false
                    )}
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
      {toast && (
        <View
          style={[
            {
              alignSelf: "center",
              borderRadius: 8,
              width: "90%",
              height: "5%",
              position: "absolute",
              top: "95%",
              zIndex: 20,
              backgroundColor: themeLiteral() == "light" ? "black" : "white",
            },
          ]}
        >
          <Text
            style={[
              commonFontWeight({ bold }),
              commonForeground(theme),
              {
                fontSize: global.device == "2" ? 20 : 17,
                color: themeLiteral() == "light" ? "white" : "black",
                fontFamily: "NotoSans-Regular",
                textAlign: "left",
                paddingVertical: 8,
                marginLeft: 10,
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
  title: {
    textAlign: "center",
    marginBottom: 16,
    marginHorizontal: 13,
    marginVertical: Platform.OS === "android" ? 0 : 35,
  },
  container: { flex: 1, padding: 16, width: "94%", alignSelf: "center" },
  item: {
    width: "100%",
    flexWrap: "wrap",
 //   paddingVertical: Platform.OS === "android" ? 28 : global.device == "2" ? -30 : 10,
    fontWeight: "bold",marginBottom:10
  },
  tinyLogo: {
    height:
      Platform.OS === "android"
        ? global.device == "2"
          ? 350
          : 190
        : global.device == "2"
        ? 400
        : 190,
    width: Platform.OS === "android" ? 160 : global.device == "2" ? 150 : 150,
    marginTop:
      Platform.OS === "android" ? -47 : global.device == "2" ? -50 : -40,
    marginBottom:
      Platform.OS === "android" ? -22 : global.device == "2" ? -50 : -22,
    marginLeft:
      global.device == "2"
        ? Platform.OS === "android"
          ? 170
          : 270
        : Platform.OS === "android"
        ? 15
        : 10,
    overflow: "hidden",
    resizeMode: "cover",
  },
   tinyLogo1: {width:'100%',resizeMode: "cover"},
  itemContainer: {
     padding: Platform.OS === "android" ? 10 : global.device == "2" ? 40 : 10,
  /*  flexDirection: "column", */
    width: "70%",
  },

  imageContainer: {
    width: "30%",height:'100%',

  },
  image: {
    width: "100%",
    height: "75%",
    resizeMode: "contain",
    marginBottom: 10,
    paddingTop: 15,
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
  titleErr: {
    textAlign: "left",
    marginBottom: 16,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
});
export default FollowingListScreen;


                   /*  <Text style={[CommonZoomStyle("small", { zoom }),commonForeground(theme),]} numberOfLines={1} ellipsizeMode="tail" >
                        {convertDateCategory(item.date)}
                    </Text> */

///////////////
/* function adjDate(category){
         let str=convertDateCategory(category);
         let dl=str.split(' ');
         if(!i18n.isFrench() ||dl[0]!=1)return <Text style={[global.device == "2"? CommonZoomStyle("small4", { zoom }): CommonZoomStyle("small", { zoom }),commonForeground(theme),]} numberOfLines={1} ellipsizeMode="tail" >
            {str}
         </Text>;
         let s=global.device == "2"? commonZoomSizeFix("small4", { zoom }): commonZoomSizeFix("small", { zoom });console.log('size:......',s);
         return <View style={[{flexDirection:'row',alignItems:'center'},commonForeground(theme),{marginTop: Platform.OS === "android" ? -1 : 3,},]}>
                   <Text style={[global.device == "2"? CommonZoomStyle("small4", { zoom }): CommonZoomStyle("small", { zoom }),styles.date,commonForeground(theme)]}>{dl[0]}</Text>
                   <Text style={[global.device == "2"? CommonZoomStyle("small5", { zoom }): CommonZoomStyle("small1", { zoom }),{marginTop:-s*0.8},commonForeground(theme)]}>er</Text>
                   <Text style={[global.device == "2"? CommonZoomStyle("small4", { zoom }): CommonZoomStyle("small", { zoom }),styles.date,commonForeground(theme)]}> {dl[1]}</Text>
                   <Text style={[global.device == "2"? CommonZoomStyle("small4", { zoom }): CommonZoomStyle("small", { zoom }),styles.date,commonForeground(theme)]}> {dl[2]}</Text>
               </View>;
      } */
