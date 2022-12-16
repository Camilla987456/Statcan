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
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import {
  CommonStyles,
  webviewTheme,
  commonBackground,
  commonForeground,
  followingTheme,
} from "../normalization.js";
import "../settings.js";
import i18n from "../resources.js";
import WebView from "react-native-webview";
import { Feather } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const bannerPathEnglish = require("../assets/statscan_banner.png");
const bannerPathFrench = require("../assets/statscan_banner_fr.png");

const BrowseSearchScreen = ({ route, navigation }) => {
  const { url } = route.params;
  console.log("Url(in startup):" + url);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [theme, setTheme] = useState(global.theme);
  const webviewRef = useRef(null);
  const backButtonHandler = () => {
    global.prevNavigateRoute == "FollowingScreen"
      ? navigation.navigate("Following")
      : navigation.navigate("SearchScreen");
    if (webviewRef.current) webviewRef.current.goBack();
    else {
      console.log("Prev route:" + global.prevNavigateRoute);
      global.prevNavigateRoute == "FollowingScreen"
        ? navigation.navigate("Following")
        : navigation.navigate("SearchScreen");
    }
  };

  const frontButtonHandler = () => {
    if (webviewRef.current) webviewRef.current.goForward();
  };
  const displaySpinner = () => {
    return (
      <View>
        <ActivityIndicator
          size="large"
          style={{ position: "absolute", top: "50%", left: "50%", zIndex: 20 }}
          color="#009688"
        />
      </View>
    );
  };
  console.log("indicator global in searchBrowser:" + global.indicator);

  const [count, setCount] = useState(0);
  const [name, setName] = useState(i18n.t("name"));
  const [title, setTitle] = useState("");
  const [loaded, setLoaded] = useState(false);

  const removeStart = "(function(){var dom=window.location.hostname;";
  const monitorAnchorClick =
    'var ls = document.getElementsByTagName("a");for(var i = 0, len = ls.length; i < len; i++) {ls[i].onclick = function () {window.ReactNativeWebView.postMessage("Link:"+"Clicked--->"+document.title);}};';
  const removeHeader =
    'document.getElementsByTagName("header")[0].style.display="none";';
  const removeFooter =
    'document.getElementsByTagName("footer")[0].style.display="none";';
  const checkDaily =
    'if(document.title.indexOf("StatCanPlus")<0){var x=document.querySelectorAll("main >div");for(var i=0;i<x.length;i++)x[i].style.display="none"; document.querySelectorAll("div.release_nav")[0].style.display="none";}';
  const removeSection =
    'document.querySelectorAll("section.lng-ofr")[0].style.display = "none";';
  const removeSidebar =
    'document.querySelectorAll("div.col-xs-12.col-sm-12.col-lg-4")[0].style.display = "none";document.getElementById("mobile-shortcut").style.display = "none";';
  const removePlus =
    'document.querySelectorAll("div.panel-pane.pane-entity-field.pane-node-field-title-markup")[0].style.display = "none";';
  const removeShortcut =
    'document.querySelectorAll("p.text-right.hidden-lg.hidden-xl")[0].style.display = "none";';
  const removeBottom =
    'document.querySelectorAll("div.col-md-12.region-laurier-bottom")[0].style.display = "none";';
  const removeHighlights =
    'document.querySelectorAll("div.text-center.mrgn-bttm-md")[0].style.display = "none";document.querySelectorAll("h2.mrgn-tp-md")[0].style.display = "none";';
  const changeMeta =
    'const meta = document.createElement("meta"); meta.setAttribute("content", "width=device-width, initial-scale=1.5, maximum-scale=1.5, user-scalable=0"); meta.setAttribute("name", "viewport"); document.getElementsByTagName("head")[0].appendChild(meta);';
  const removeChat =
    'document.getElementById("lz_overlay_chat").style.display = "none";document.getElementById("lz_overlay_wm").style.display = "none";document.getElementById("lz_overlay_preview").style.display = "none";';
  const zoomBody = 'document.body.style.zoom = "' + global.zoom * 100 + '%";'; //`document.body.style.zoom = "${global.zoom*100}%";`;   //'document.body.style.zoom = "'+global.zoom*100+'%";';
  const removeEnd =
    'window.ReactNativeWebView.postMessage("Title:"+$("title").text());})();';

  //const changeThemeD='document.body.style.background = "black";document.querySelectorAll("div.panel-body").forEach(e =>{ e.style.color = "white";e.style.backgroundColor = "black";});';
  //const changeThemeL='document.body.style.background = "white";document.querySelectorAll("div.panel-body").forEach(e =>{ e.style.color = "black";e.style.backgroundColor = "white";});';
  const changeTheme = webviewTheme(theme);
  //For following
  const removeFollowingDiv =
    'document.querySelectorAll("div.region-hadfield-bottom")[0].style.display = "none";document.querySelectorAll("div.region-hadfield-top")[0].style.display = "none";document.querySelectorAll("div.col-md-4.region-hadfield-first")[0].style.display = "none";document.querySelectorAll("div.panel-pane.pane-block.pane-bean-ndm-data-top-link")[0].style.display = "none";document.querySelectorAll("div.panel-pane.pane-ndm-sortbox")[0].style.display = "none";';
  const removeFollowingDetail =
    'var ds=document.querySelectorAll("div#ndm-results.tabpanels details:not(:first-child)");for(var i=0;i<ds.length;i++)ds[i].style.display = "none";';
  const changeFollowingTheme = followingTheme(theme); //'document.body.style.backgroundColor="black";document.querySelectorAll("details#all li,span,a,div").forEach(e =>{ e.style.color = "white";e.style.backgroundColor = "black";});';

  //tobe deleted
  const changeTheme1 =
    'document.body.style.background = "black";document.body.style.color= "white!important";';
  const removeSidebar1 =
    'document.querySelectorAll("div.col-xs-12.col-sm-12.col-lg-4")[0].style.display = "none";document.querySelectorAll("div.alert-info")[0].style.display = "none";document.querySelectorAll("p.hidden-lg")[0].style.display = "none";document.querySelectorAll("div.col-lg-4")[0].style.display = "none";document.querySelectorAll("h2.mrgn-tp-md")[0].style.display = "none"; document.querySelectorAll("div.mrgn-bttm-md")[0].style.display = "none";document.querySelectorAll("div.region-lautier-bottom")[0].style.display = "none";';

  const removeNavbar =
    'document.getElementById("navbar").style.display = "none";'; //problem
  const removeOthers =
    'document.querySelectorAll("div.panel-pane")[0].style.display = "none";document.querySelectorAll("div.alert-info")[0].style.display = "none";document.querySelectorAll("p.hidden-lg")[0].style.display = "none";document.querySelectorAll("div.col-lg-4")[0].style.display = "none";document.querySelectorAll("h2.mrgn-tp-md")[0].style.display = "none"; document.querySelectorAll("div.mrgn-bttm-md")[0].style.display = "none";document.querySelectorAll("div.region-lautier-bottom")[0].style.display = "none";window.ReactNativeWebView.postMessage("Title:"+$("title").text());})();';

  let js =
    global.prevNavigateRoute == "FollowingScreen"
      ? removeStart +
        removeHeader +
        removeFooter +
        removeFollowingDiv +
        removeFollowingDetail +
        zoomBody +
        changeFollowingTheme +
        removeEnd
      : removeStart +
        removeHeader +
        removeFooter +
        removeSidebar +
        removePlus +
        removeShortcut +
        removeHighlights +
        removeBottom +
        removeSection +
        zoomBody +
        changeTheme +
        removeChat +
        changeTheme +
        removeEnd;

  // const [jscode, setJscode] = useState('alert("yyyy");window.ReactNativeWebView.postMessage("hello");');
  // const [jscode, setJscode] = useState(removeStart+changeTheme+removeEnd);
  const [jscode, setJscode] = useState(js);
  //  const [jscode, setJscode] = useState('(function(){document.getElementsByTagName("main")[0].style.color="red";document.getElementsByTagName("main")[0].style.background-color="yellow";var ls = document.getElementsByTagName("a");for(var i = 0, len = ls.length; i < len; i++) {ls[i].onclick = function () {window.ReactNativeWebView.postMessage("Link:"+"Clicked--->"+document.title);}};document.getElementsByTagName("footer")[0].style.display="none";document.getElementsByTagName("header")[0].style.display="none";if(document.title.indexOf("StatCanPlus")<0){var x=document.querySelectorAll("main >div");for(var i=0;i<x.length;i++)x[i].style.display="none";document.querySelectorAll("div.release_nav")[0].style.display="none";}document.getElementById("navbar").style.display = "none";document.querySelectorAll("div.panel-pane")[0].style.display = "none";document.querySelectorAll("div.alert-info")[0].style.display = "none";document.querySelectorAll("p.hidden-lg")[0].style.display = "none";document.querySelectorAll("div.col-lg-4")[0].style.display = "none";document.querySelectorAll("h2.mrgn-tp-md")[0].style.display = "none"; document.querySelectorAll("div.mrgn-bttm-md")[0].style.display = "none";document.querySelectorAll("div.region-lautier-bottom")[0].style.display = "none";window.ReactNativeWebView.postMessage("Title:"+$("title").text());})();');
  //Plus
  //const [uri, setUri] = useState('https://www150.statcan.gc.ca/n1/pub/11-627-m/11-627-m2021042-eng.htm');
  const [uri, setUri] = useState(
    i18n.isFrench
      ? "https://www.statcan.gc.ca/fra/quo/statcanplus"
      : "https://www.statcan.gc.ca/eng/dai/statcanplus"
  );

  // const [uri, setUri] = useState('https://www.statcan.gc.ca/eng/quo/statcanplus');   //French
  // const [uri, setUri] = useState('https://www120.statcan.gc.ca/stcsr/en/sr1/srs?q=&start=0&showSum=hide&fq=stclac%3A2');   //Search
  const goSearch = () => {
    setUri(
      "https://www120.statcan.gc.ca/stcsr/en/sr1/srs?q=&start=0&showSum=hide&fq=stclac%3A2"
    );
    //  if (webviewRef.current) webviewRef.current.goBack();
    console.log("url(goSearch):  " + uri);
  };
  const goPlus = () => {
    setUri("https://www.statcan.gc.ca/eng/dai/statcanplus");
  };
  const goFavorites = () => {
    Alert.alert(title, uri);
  };
  const ActivityIndicatorElement = () => {
    return (
      <View
        style={[
          {
            flex: 1,
            zIndex: 20,
            width: "100%",
            height: "100%",
            marginTop: -700,
          },
          commonBackground(theme),
        ]}
      >
        <ActivityIndicator
          color="#009688"
          size="large"
          style={styles.activityIndicatorStyle}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[CommonStyles.safeArea, commonBackground(theme)]}>
      <View style={[styles.topBar, commonBackground(theme)]}>
        <TouchableOpacity
          onPress={backButtonHandler}
          style={{ justifyContent: "center", alignItems: "center", width: 30 }}
        >
          <Feather
            name="arrow-left"
            size={24}
            style={[{ marginLeft: 2 }, commonForeground(global.theme)]}
          />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: "white",
            padding: 4,
            marginRight: 5,
            marginLeft: 10,
            flexGrow: 1,
          }}
        >
          <Image
            source={
              i18n.locale == "fr-CA" ? bannerPathFrench : bannerPathEnglish
            }
            style={styles.image}
          />
        </View>
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center", width: 30 }}
          onPress={goFavorites}
        >
          <Feather
            name="heart"
            size={24}
            style={{ marginLeft: 2, color: "black" }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center", width: 30 }}
          onPress={goSearch}
        >
          <Feather
            name="search"
            size={24}
            style={{ marginLeft: 2, color: "black" }}
          />
        </TouchableOpacity>
      </View>
      {
        //    !loaded && <View style={[{height:windowHeight,zIndex:200,alignItems:'center',justifyContent:'center'},commonBackground(theme)]}><ActivityIndicator color="#009688" size="large" style={styles.activityIndicatorStyle} /></View>
      }
      <WebView
        style={commonBackground(theme)}
        ref={webviewRef}
        containerStyle={{ flex: 1 }}
        incognito={true}
        useWebKit={true}
        scrollEnabled={true}
        source={{ uri: url }} //change back to url after testimg(for real statcan plus)
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        startInLoadingState={true}
        injectedJavaScript={jscode}
        renderLoading={ActivityIndicatorElement}
        automaticallyAdjustsScrollViewInsets={false} showsVerticalScrollIndicator={false}
        onNavigationStateChange={(navState) => {
          console.log("current url on navigation state change:" + navState.url);
          setCanGoBack(navState.canGoBack);
          setCanGoForward(navState.canGoForward);
        }}
        onMessage={(event) => {
          var ss = event.nativeEvent.data;
          /* if(ss==="Link:Clicked"){
                            //  setInterval(function(){ setLoaded(false); }, 1000);
                             setLoaded(false);
             }else {setTitle(ss);}
*/
          console.log("sa-code=======" + ss);
        }}
        onLoadEnd={(syntheticEvent) => {
          // alert('done');
          //   setLoaded(true);setJscode('');
        }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    width: "80%",
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  activityIndicatorStyle: {
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    top: "30%",
    left: "50%",
    zIndex: 20,
  },
  image: {
    maxWidth: 320,
    minWidth: 250,
    height: 40,
    backgroundColor: "white",
  },
  icon: {
    maxWidth: 40,
    minWidth: 40,
    height: 80,
    backgroundColor: "white",
    marginTop: 10,
    marginLeft: 20,
  },
  footer: {
    width: 30,
    height: 30,
    margin: 20,
    /* maxWidth: 40,
                minWidth: 40,
                height: 80,
                backgroundColor:'white',marginTop:10,marginLeft:20,alignSelf:'flex-end'*/
  },
  topBar: {
    //   backgroundColor: "white",
    marginTop: 24,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  menuBar: {
    backgroundColor: "blue",
    flexDirection: "column",
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 2,
    paddingTop: 4,
    paddingBottom: 4,
  },
  menuItem: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "white",
    padding: 5,
    marginTop: 2,
    zIndex: 99,
  },
  tabBarContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#b43757",
  },
  button: {
    color: "white",
    fontSize: 24,
  },
});
export default BrowseSearchScreen;
