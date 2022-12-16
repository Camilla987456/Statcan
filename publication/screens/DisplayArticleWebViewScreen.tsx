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
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableWithoutFeedback,
  Share,
  Linking,
  findNodeHandle,
  Platform,
  AccessibilityInfo,
  AppState,
  Appearance,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../settings.js";
import i18n from "../resources.js";
import {
  commonBackgroundColor,
  commonForegroundColor,
  commonZoomSize,
  CommonStyles,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
  commonFrameBackground,
  commonForegroundHighlightColor,
  themeLiteral,
  commonForegroundDes,
  commonCardBackground,
  commonIcons,
} from "../normalization.js";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import {decodeHtmlCharCodes} from "../services";
import DisplayHtmlScreen from "./DisplayHtmlScreen";
//import RenderHtmlScreen from "./RenderHtmlScreen";
const banner = require("../assets/img_canadamdpi.png");
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
let iw = windowWidth * global.zoom * 1.25;
let articleTitle = "";
const DisplayArticleWebViewScreen = ({ route, navigation }) => {
  const pubRef = useRef(null);const menuRef = useRef(null);
  let { item,idd } = route.params;  idd=route.params.id;let dl=idd?40:10;
  let id =item? route.params.item.id:idd?idd:0;global.articleId=id;
//console.log('route in Display....................................................................:',global.prevNavigateRoute);
  let inProcess = false;let isMounted=false;
  let shareURL =item? item.url:null;
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(false);
  const [name, setName] = useState("");
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(i18n.t("saveItemToast"));
  const [count, setCount] = useState(0);
  const [zoom, setZoom] = useState(global.zoom);
  const [bold, setBold] = useState(global.bold);
  const [theme, setTheme] = useState(global.theme);
  const [reader, setReader] = useState(false);
  global.appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();
  let s = global.savedItems.some((x) => x == id.toString());

  const [saved, setSaved] = useState(s);
  const { width, height } = useWindowDimensions();
  const isLandscapeMode = width > height ? true : false;

  const wp = Platform.OS === "android" ? 100 : 90;
  const monitorAnchorClick =
    'var ls = document.getElementsByTagName("a");for(var i = 0, len = ls.length; i < len; i++) {ls[i].onclick = function () {var href =this.dataset.href;window.ReactNativeWebView.postMessage("Link:"+href);}};';
  const script = `<script>(function () {var ls = document.getElementsByTagName("a"); for (var i = 0, len = ls.length; i < len; i++) { ls[i].onclick = function () { var href1 = this.dataset.href;var href=this.getAttribute("href");if(href1!=undefined &&href!=null)this.setAttribute("href","#"); window.ReactNativeWebView.postMessage("Link$" + href1+'$'+href); } };})();</script>`;
  let styleL = `<style>body {white-Space: normal;color:#333333;width: ${wp}%;height: 100%;font-size:40px;padding-right:50px;padding-left:40px;background-color:white;zoom:${
    global.zoom * 100
  }%} a{color:  #59268C;text-decoration: underline;word-wrap:break-word;}  hr{background-color: #29415C;} img{max-width:100%!important;max-height:100%;object-fit: contain;width: auto;height: auto;} a:not([href]){font-weight:normal!important;text-decoration:none!important;} abbr{text-decoration: none !important;} p{over-flow-wrap: break-word;}</style>`;
  let styleD = `<style>body {white-Space: normal;color:white;width: ${wp}%;height: 100%;font-size:40px;padding-right:50px;padding-left:40px;background-color:#151E29;zoom:${
    global.zoom * 100
  }%} a{color: #CE9FFD;text-decoration: underline;word-wrap:break-word;}  hr{background-color:white;} img{max-width:100%!important;max-height:100%;object-fit: contain;width: auto;height: auto;}  a:not([href]){font-weight:normal!important;text-decoration:none!important;} abbr{text-decoration: none !important;} p{over-flow-wrap: break-word;}</style>`;

  const [content, setContent] = useState("");
  const getArticle = async () => {
    setLoading(true);
    let url = i18n.isFrench()
      ? global.pubApiUrlBaseFr + `article/${global.articleId}`
      : global.pubApiUrlBaseEn + `article/${global.articleId}`;
    console.log("article url in func=====", url);
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        let html = generateHtml(result); //console.log('html:',html);
        setContent(html);
        setLoading(false);

        /*   s = global.savedItems.some((x) => x == global.articleId.toString());setSaved(s);
        console.log("Saved in display2:",global.articleId, s,saved); */
      })
      .catch((error) => {
        console.warn("exception:", error);
        setContent(`<p style="font-size:70px;">${i18n.t("dataError")}</p>`);
        setLoading(false);
      });
  };
  const checkReader = async () => {
    let r = await AccessibilityInfo.isScreenReaderEnabled();
    setReader(r);
  };
  const convertDate = (s) => {
    console.log(s); //2021-11-18T08:32:01-0500
    const monthE = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthF = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];
    //test
    //s='2021-05-18T08:32:01-0500'
    let ind = s.lastIndexOf("-");
    let ss = s;
    if (!ss.endsWith("Z"))
      ss = ss.substring(0, ind) + "." + ss.substring(ind + 1) + "Z";

    let secs = s.split("T");
    let ds = secs[0].split("-");
    let ts1 = secs[1].split("-");
    let ts = ts1[0].split(":");
    let z = i18n.isFrench() ? "(HNE)" : "(EST)";
    let m = Math.max(
      ...[0, 6].map((v) => new Date(95, v, 1).getTimezoneOffset())
    );
    if (new Date(ss).getTimezoneOffset() < m)
      z = i18n.isFrench() ? "(HAE)" : "(EDT)";

    if (i18n.isFrench()) {
      if (parseInt(ds[2]) == 1)
        return `${parseInt(ds[2])}ᵉʳ ${monthF[parseInt(ds[1]) - 1]} ${ds[0]}, ${
          ts[0]
        } h ${ts[1]} ${z}`;
      else
        return `${parseInt(ds[2])} ${monthF[parseInt(ds[1]) - 1]} ${ds[0]}, ${
          ts[0]
        } h ${ts[1]} ${z}`;
    } else {
      let apm = "a.m.";
      let h = parseInt(ts[0]);
      if (h == 12) {
        apm = "p.m.";
      } else if (h > 12) {
        apm = "p.m.";
        h = h - 12;
      }
      return `${monthE[parseInt(ds[1]) - 1]} ${parseInt(ds[2])}, ${
        ds[0]
      }, ${h}:${ts[1]} ${apm} ${z}`;
    }
  };
  const generateHtml = (a) => {
    articleTitle = a.title;
    if(!shareURL)shareURL=a.url;
    if(!item)item={id:a.id,title:decodeHtmlCharCodes(a.title),
                    date: a.published_date,
                    categoryId: a.subject_id,
                    image: a.branding_image_src,
                    imageLabel: a.branding_image_alt,
                    subject: a.subject_name,
                    url: a.url,
    }; 
    let ht = `<h2>${a.title}</h2>`;
    let ca = `<span style="font-size:40px;Color:${
      themeLiteral() == "light" ? "#707070" : "white"
    };">${a.subject_name}</span><br/>`;
    let dt = `<span style="font-size:40px;Color:${
      themeLiteral() == "light" ? "#707070" : "white"
    };">${convertDate(a.published_date)}</span><br/><br/>`;
    let logo = `<img src=${a.branding_image_src} alt=${a.branding_image_alt} width="100%" height="500">`;
    let img = a.branding_image;
    if (a.content === undefined) {
      return (a.content = `<h1>No Content Found</h1>`);
    }
    let ct = a.content.join("");
    // ct = ct.replace("href", "href='#' data-href");
    ct = ct.replace(/href/g, "href='#' data-href");

    //  let ft = `<hr><p><a href='#' data-href='sharepub'>${i18n.t('sharethisapp')}</a> </p><p><a href='#' data-href='contactus'>${i18n.t('contactus')}</a></p><br/>`;
    let ft = `<hr><p><a href='#' style="width:100%"; color:'#335075'  data-href='sharepub'><div style="border: 3px solid #26374A;height:100px; display: inline-block; width: 95%; white-space: nowrap; vertical-align: middle;margin:auto;background:white;border-radius:15px;">
                <span style="float: left; vertical-align: middle; height: 100%; margin-top: 24px;margin-left:50px;font-size:40px!important;color:#26374A;font-weight: bold;">${i18n.t(
                  "sharethisapp"
                )}</span>
                <img style="float:right;margin-top:18px;margin-right:30px;width:54px!important;height:60px;" src="data:image/png;base64,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" />
             </div></a></p><br/>`;
    let ftd = `<hr><p><a href='#' style="width:100%";color:'#335075' data-href='sharepub'><div style="border: 3px solid #26374A;height:100px; display: inline-block; width: 95%; white-space: nowrap; vertical-align: middle;margin:auto;background:#29415C;border-radius:15px;">
                <span style="float: left; vertical-align: middle; height: 100%; margin-top: 24px;margin-left:50px;font-size:40px!important;color:white;font-weight: bold;">${i18n.t(
                  "sharethisapp"
                )}</span>
                <img style="float:right;margin-top: 18px;margin-right:30px;width:54px!important;height:60px;" src="data:image/png;base64,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" />
              </div></a></p><br/>`;
    /*

   let ftd = `<hr><p><a href='#' style="width:100%;" data-href='sharepub'><div style="border: 2px solid lightgray;height:60px; display: inline-block; width: 90%; white-space: nowrap; vertical-align: middle;margin-right:4%; margin-left:5%;">
                                             <span style="float: left; vertical-align: middle; height: 100%; margin-top: 6px;font-size:50px!important;">${i18n.t("sharethisapp")}</span>
                                             <img style="float:right;margin-right:6px;width:54px;height:54px!important;" src="data:image/png;base64,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" />

                                         </div></a> </p>
                   <p><a href='#' style="width:100%;" data-href='contactus'><div style="border: 2px solid lightgray; height:60px; display: inline-block; width: 90%; white-space: nowrap; vertical-align: middle; margin-right:4%; margin-left:5%;">
                                             <span style="float: left; vertical-align: middle; height: 100%; margin-top: 6px;font-size:50px!important;">${i18n.t(
                                               "contactus"
                                             )}</span>
                                              <img style="float:right;margin-right:6px;width:54px;height:54px!important;" src="data:image/png;base64,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" />

                                                       </div></a></p><br/>`;
 */

    let style = themeLiteral() == "light" ? styleL : styleD;
    let footer = themeLiteral() == "light" ? ft : ftd;
    let bd =
      `<!DOCTYPE html><html lang="${
        i18n.isFrench() ? "fr" : "en"
      }" xmlns="http://www.w3.org/1999/xhtml">` +
      style +
      `<body>${ht}${ca}${dt}${ct}${footer}${script}</body>` +
      `</html>`;
    return bd;
  };


  React.useEffect(() => {
    navigation.addListener("focus", () => {
      setZoom(global.zoom);
      setBold(global.bold)
      setMenu(false);
      setName(i18n.t("home"));
      setTheme(global.theme);
      getArticle();
      checkReader();
      iw = windowWidth * global.zoom * 1.25;

      s = global.savedItems.some((x) => x == global.articleId.toString());
      setSaved(s);
      console.log("Saved in display3:", global.articleId, s, saved);

setTimeout(() => {
 if (pubRef != null && pubRef.current != null){
            const reactTag = findNodeHandle(pubRef.current);
           AccessibilityInfo.setAccessibilityFocus(reactTag);
        }
      }, 1000);
      // s = global.savedItems.some((x) => x == global.articleId.toString());
      // setSaved(s);
      // console.log("Saved in display3:", global.articleId, s, saved);
      global.indicator++;
      global.screen = "Article";
      setCount(global.indicator);
    });

    navigation.addListener("blur", () => {
      setContent("");
    });
    s = global.savedItems.some((x) => x == global.articleId.toString());
    setSaved(s);
    console.log("Saved in display4:", global.articleId, s, saved);
    isMounted = true;
    //  const subscriptionP = AppState.addEventListener("change", handleAppStateChange);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const subscriptionA = AppState.addEventListener(
        "change",
        handleAppStateChangeA
      );
      console.log("subscription removed in Article");
      return () => {
        if (subscriptionA) subscriptionA.remove();
        console.log("subscription removed in Article");
      };
    }, [])
  );
  const handleAppStateChangeA = (nextAppState) => {
    if (!isMounted) return;
    console.log(
      "Article1 detected state change:",
      global.screen,
      "sub:",
      global.subScreen,
      "State:",
      appState,
      "isMounted:",
      isMounted
    );
    if (global.screen == "Article") {
      try {
        getArticle();
        appState.current = nextAppState;
      } catch (err) {
        console.log("err in Article");
        return;
      }
    }
  };

  const onBackButtonClick = () => {
    console.log("webdisplay in process:.....prevNavigateRoute:", global.prevNavigateRoute);
    if (!inProcess) {
       if(global.prevNavigateRoute === "SearchScreen"){
           if (navigation.canGoBack()) {navigation.goBack();}else {navigation.navigate("Main");}
       }else{
          global.prevNavigateRoute === "" ? navigation.navigate("Main")
         :global.prevNavigateRoute === "FollowingList"? navigation.navigate("FollowingList", { items: global.followingList })
         :global.prevNavigateRoute === "Following"?navigation.navigate('Main', {screen: 'HomeTab',params: {screen: 'FollowingStack',params: {screen: 'Following',},},})
         :global.prevNavigateRoute === "SavedItem"?navigation.navigate("Main",{ screen: 'SavedItem' })
         :navigation.navigate(global.prevNavigateRoute);
       }


        global.prevNavigateRoute = "";
    }
  };
  const onShare = async () => {
    let text3=`\n\nTest:\n\nstc://article/${id}\n\nhttps://www.statcan.gc.ca/o1/en/api/plus/article/${id}\n\nhttps://www.statcan.gc.ca/article/${id}\n\nhttps://www.statcan.gc.ca/mobile?id=${id}`; console.log('Test....',text3)
    let text2 = ""; // i18n.t("shareappMsg");
    Platform.OS === "android"
      ? (text2 = text2.concat(i18n.t("playstoreLink2")))
      : (text2 = text2.concat("\n", i18n.t("appstoreLink2")));
    let text = i18n.t("shareArticleMsg"); // i18n.t("sharepubMsg");
    try {
      const result = await Share.share(
        {
          title: i18n.t("sharepubMsg"),
          message: text + "\r\n" + shareURL + "\n\n" + i18n.t("app") + text2,//+text3,
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
      alert(i18n.t("internalErr"));
    }
    setMenu(false);
  };
  const onContactUs = () => {
    setMenu(false);
    global.prevNavigateRoute = "DisplayArticle";
    navigation.navigate("ContactUs", { item: item });
    setMenu(false);
  };

  const goFavorites = () => {
    setToast(true);
    inProcess = true;
    console.log("start saving:", inProcess);
    if (saved) {
      setToastMsg(i18n.t("removeItemToast"));
      if (reader)
        setTimeout(() => {
          AccessibilityInfo.announceForAccessibility(i18n.t("removeItemToast"));
        }, 1000);
      global.savedItems = global.savedItems.filter((item) => item !== id);
      AsyncStorage.setItem("SavedItems", JSON.stringify(global.savedItems));
      setSaved(false);
    } else {
      setToastMsg(i18n.t("saveItemToast"));
      if (reader)
        setTimeout(() => {
          AccessibilityInfo.announceForAccessibility(i18n.t("saveItemToast"));
        }, 1000);
      if (!global.savedItems.some((x) => x === id)) global.savedItems.push(id);
      AsyncStorage.setItem("SavedItems", JSON.stringify(global.savedItems));
      setSaved(true);
      /* if (i18n.isFrench()) {
        if (!global.savedItemsF.includes(id)) {
          global.savedItemsF.push(id);
          AsyncStorage.setItem(
            "SavedItemsF",
            JSON.stringify(global.savedItemsF)
          );
        }
        setSaved(true);
      } else {
        if (!global.savedItemsE.includes(id)) {
          global.savedItemsE.push(id);
          AsyncStorage.setItem(
            "SavedItemsE",
            JSON.stringify(global.savedItemsE)
          );
        }
        setSaved(true);
      } */
    }
    setTimeout(() => {
      setToast(false);
      inProcess = false;
    }, 2000);
  };

  const onShouldStartLoadWithRequest = (request) => {
    if (request.navigationType === "click") {
      // Open all new click-throughs in external browser.
      Linking.openURL(request.url);
      return false;
    }
    return true;
  };

  const onMessage = (event) => {
    let s = event.nativeEvent.data;
    console.log("Test message", s);
    let dis = s.split("$");
    if (dis[0] == "Link") {
      if (dis[1] == "contactus") {
        global.prevNavigateRoute = "Publications";
        navigation.navigate("ContactUs", { item: item });
      } else if (dis[1] == "sharepub") onShare();
      else {
        if (
          dis[1] != "" &&
          dis[1] != "undefined" &&
          dis[1] != null &&
          dis[1] != "#"
        ) {
          if (dis[1].startsWith("mailto:")) {
            Linking.openURL(`${dis[1]}?subject=${articleTitle}`);
          } else if (dis[1].startsWith("tel:")) {
            Linking.openURL(dis[1]);
          } else if (dis[1].startsWith("sms:")) {
            Linking.openURL(dis[1]);
          } else if (dis[1].startsWith("http")) {
            //  global.prevNavigateRoute ="NotificationList";// "DisplayArticle";
            navigation.navigate("Browse", { url: dis[1] });
          }
        }
      }
    }
  };

  const [show, setShow] = useState(false);
     console.log('is screen reader:',reader);
      let disp={position:"absolute",top:global.device == "2"? "12%": Platform.OS == "android"? "10%": "15%",right: "5%",left: "15%",zIndex: 1,};
      if(reader)disp={marginTop:18};
  return (
    <SafeAreaView style={[commonBackground(theme),CommonStyles.safeArea]}>
      <View
        style={[
         
          isLandscapeMode?
               styles.headerLandscape
            : styles.header,
          styles.headerItem,
          {marginTop:dl}
        ]}
      >
        <TouchableOpacity ref={pubRef}
          style={[CommonStyles.tapSpot,styles.headerItem]}
          accessibilityRole="button"
          accessible={true}
          tabIndex="1"
          onPress={onBackButtonClick}
          accessibilityLabel={i18n.t("goBack")}
        >
          <Feather
            name="chevron-left"
            size={global.device == "2" ? 50 : 25}
            style={[{ marginLeft: "8%" }, commonForegroundDes(theme)]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          tabIndex="2"
          style={[CommonStyles.tapSpot, styles.headerItem]}
          accessibilityRole="header"
          accessible={true}
        >
          <Text
            style={[
              global.device == "2"
                ? CommonZoomStyle("mediumF2", { zoom })
                : CommonZoomStyle("mediumF1", { zoom }),
              commonFontWeight({ bold }),
              commonForegroundDes(theme),
              {
                marginLeft: global.device == "2" ? "5%" : "10%",
              },
            ]}
            accessibilityRole="header"
            accessible={true}
          >
            {i18n.t("HeadingSecondLevel")}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          {
            <TouchableOpacity
              tabIndex="3"
              style={[
                {
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: 30,
                },
                CommonStyles.tapSpot,
                styles.headerItem,
              ]}
              onPress={goFavorites}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel={i18n.t("saveItem")}
            >
              {saved ? (
                <Ionicons
                  name="heart-sharp"
                  size={global.device == "2" ? 50 : 24}
                  style={[
                    {
                      paddingHorizontal: 16,
                      paddingTop: Platform.OS === "android" ? 4 : 5,
                    },
                    commonIcons(theme),
                  ]}
                />
              ) : (
                <Ionicons
                  name="heart-outline"
                  size={global.device == "2" ? 50 : 24}
                  style={[
                    {
                      paddingHorizontal: 16,
                      paddingTop: Platform.OS === "android" ? 4 : 5,
                    },
                    commonForegroundDes(theme),
                  ]}
                />
              )}
            </TouchableOpacity>
          }

          <TouchableOpacity
            ref={menuRef}
            tabIndex="4"
            style={[
              { marginRight: 5 },
              CommonStyles.tapSpot,
             isLandscapeMode?global.device=='2'? styles.headerItemIpad: styles.headerItem :styles.headerItem,
            ]}
            accessibilityRole="button"
            accessible={true}
            onPress={() => setMenu(!menu)}
            accessibilityLabel={i18n.t("dropdownMenu")}
          >
            <Feather
              name="more-horizontal"
              size={global.device == "2" ? 50 : 24}
              style={[commonForegroundDes(theme)]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {menu && (
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
              shadowColor: Platform.OS == "android" ? "" : "#92A8C14D", // IOS
              elevation: global.device == "2" ? 24 : 12,
              marginTop: isLandscapeMode
                ? Platform.OS == "android"
                  ? "3%"
                  : "0%"
                : 0,
            },
            commonCardBackground(theme),
            disp,
          ]}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessible={true}
            onPress={onShare}
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
            onPress={onContactUs}
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
                {i18n.t("contactus")}
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
      {toast && (
        <View
          style={[commonBackground(theme),
            {
              alignSelf: "center",
              borderRadius: 5,
              width: isLandscapeMode ? "70%" : i18n.isFrench() ? "98%" : "90%",
              height: isLandscapeMode
                ? "10%"
                : global.device == "2"
                ? "6%"
                : i18n.isFrench()
                ? "6%"
                : "4%",
              position: "absolute",
              top: isLandscapeMode
                ? "89%"
                : global.device == "2"
                ? "94%"
                : "95%",
              zIndex: 20,
              // backgroundColor: themeLiteral() == "light" ? "black" : "white",
            }
            
          ]}
        >
          <Text
            style={[
              commonBackground(theme),
              commonFontWeight({ bold }),
              commonForeground(theme),
              {
                color: themeLiteral() == "light" ? "white" : "black",
                fontFamily: "NotoSans-Regular",
                textAlign: "left",
                marginLeft: 11.5,
                paddingVertical:
                  global.device == "2" ? 15 : i18n.isFrench() ? 10 : 3,
                fontSize: global.device == "2" ? 30 : i18n.isFrench() ? 12 : 15,
              },
            ]}
          >
            {toastMsg}
          </Text>
        </View>
      )}
      {loading ? (
        <View style={[{ flex: 1 }, commonBackground(theme)]}>
          <ActivityIndicator
            size="large"
            color={themeLiteral() == "light" ? "black" : "cyan"}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              zIndex: 20,
            }}
          />
        </View>
      ) : (
        <WebView
          startInLoadingState={true}
          originWhitelist={["*"]}
          source={{ html: content }}
          bounces={true}
          scrollEnabled={true}
          onMessage={onMessage}
          showsVerticalScrollIndicator={true}
          style={[styles.content, commonBackground(theme)]}
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  content: {
    marginVertical: 5,
    fontFamily: "NotoSans-Regular",
    marginHorizontal: 1,
    //  paddingHorizontal:100
  },
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
    justifyContent: "space-between",
    zIndex: 2,
  },
  headerLandscape: {
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
    marginTop: global.device=='2'?5:0,
    marginHorizontal: -50,
    width: "113%",
    paddingLeft: 30,
    paddingRight: 50,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    marginRight: "15%",
  },
  headerRight: {
    paddingVertical: 0,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: { paddingHorizontal: "4%", marginTop: 10, marginBottom: 10 },
  headerItem: { height: global.device == "2" ? 80 : 50 },
  headerItemIpad: { height: global.device == "2" ? 80 : 50, marginRight:76 },
});
export default DisplayArticleWebViewScreen;

//  onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
