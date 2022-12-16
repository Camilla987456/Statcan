/** @format */

import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,AppState,Appearance,
  AccessibilityInfo,
  Image,
  findNodeHandle,
} from "react-native";
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import {
  CommonStyles,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
  commonCardBackground,
  commonForegroundDes,
  commonBorder,
  commonForegroundColor,
  commonForegroundHighlightColor,
} from "../normalization.js";
import { WebView } from "react-native-webview";
import i18n from "../resources";
import { Feather } from "@expo/vector-icons";

const ContactUs = ({ route, navigation }) => {
  // Url of the contact us form
  let url = "https://www.statcan.gc.ca/en/reference/refcentre/form";
  if (i18n.isFrench())
    url = "https://www.statcan.gc.ca/fr/reference/centreref/formulaire";
  const { item } = route.params;
  /*@returns an Element object representing the element whose id property matches the specified string */
  const removeStart = "(function(){";
  const removeHeader = `document.getElementsByTagName("header")[0].style.display="none";`;
  const removeHeader1 = `document.getElementById("wb-cont").style.display="none";`;
  const removeFooter1 =
    'document.querySelectorAll("div.row.pagedetails")[0].style.display = "none";';
  const removeFooter2 =
    'document.getElementById("wb-info").style.display="none";';
  const removeChat =
    'document.getElementById("lz_overlay_chat").style.display = "none";document.getElementById("lz_overlay_wm").style.display = "none";document.getElementById("lz_overlay_preview").style.display = "none";';
  const removeEnd =
    'window.ReactNativeWebView.postMessage("Title:"+$("title").text());})();';
  const js =
    removeStart +
    removeHeader +
    removeHeader1 +
    removeFooter1 +
    removeFooter2 +
    removeChat +
    removeEnd;
  const conRef = useRef();
  const [jscode, setJscode] = useState(js);
  const [name, setName] = useState("");const [zoom, setZoom] = useState(global.zoom);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [bold, setBold] = useState(global.bold);
   const [theme, setTheme] = useState(global.theme);
  const webviewRef = useRef(null);const [count, setCount] = useState(0);


  const backButtonHandler = () => {
    if (webviewRef.current) webviewRef.current.goBack();
    setCanGoBack(!canGoBack);
  };
  const frontButtonHandler = () => {
    if (webviewRef.current) webviewRef.current.goForward();
    setCanGoForward(!canGoForward);
  };
  const appState = useRef(AppState.currentState);const isFocused = useIsFocused();
//  React.useEffect(() => setName(i18n.t("contactus"))), [];


  
 React.useEffect(
     () =>{
       navigation.addListener("focus", () => {
         setZoom(global.zoom);
         setBold(global.bold);
         setTheme(global.theme);
         setName(i18n.t("contactus"));
         global.screen="Settings";global.SubScreen="ContactUs";global.indicator++;setCount(global.indicator);
         setTimeout(() => {
            if (conRef != null && conRef.current != null){
                  const reactTag = findNodeHandle(conRef.current);
                   AccessibilityInfo.setAccessibilityFocus(reactTag);
                }
         }, 1000);
        },[])
      });

     useFocusEffect(
           React.useCallback(() => {
             const subscriptionF = AppState.addEventListener("change", handleAppStateChangeF);console.log('subscription removed in ContactUs');
                 return () =>{if(subscriptionF)subscriptionF.remove();console.log('subscription removed in ContactUs'); }
           }, [])
           
         );
   const handleAppStateChangeF = nextAppState => {
      console.log('ContactUs1 detected state change:',global.screen,'sub:',global.subScreen,'State:',appState);
      if(global.screen=="Settings" && global.SubScreen=="ContactUs"){
         try{
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                 global.colorScheme = Appearance.getColorScheme();global.indicator++;setCount(global.indicator);setTheme(global.theme);
                 console.log('ContactUs2.......App has come to the foreground! scheme:',global.colorScheme,commonBackground(theme));
             }
             appState.current = nextAppState;
         }catch(err){console.log('err in ContactUs');return;}
      }
   }


  
  const onBackButtonClick = () => {
    global.prevNavigateRoute === ""
      ? navigation.navigate("Main")
      : navigation.navigate(global.prevNavigateRoute, { item: item });
    global.prevNavigateRoute = "";
   
  };
  return (
    <SafeAreaView style={[CommonStyles.safeArea, commonBackground(theme)]}>
      {/* This View is used to display the header of the screen. */}
      <View style={[commonBackground(theme), styles.header]}>
        <TouchableOpacity ref={conRef}
          style={[commonBackground(theme)]}
          accessibilityRole="button"
          accessible={true} 
          onPress={onBackButtonClick}
          accessibilityLabel={i18n.t("goBack")}
        >
          <Feather
            name="chevron-left"
            size={global.device == "2" ? 50 : 25}
            style={[commonForegroundDes(theme), styles.backButton]}
          />
        </TouchableOpacity>
        <Text
          style={[
            CommonZoomStyle("medium", { zoom }),
            commonFontWeight({ bold }),
            commonForegroundDes(theme),
            { flex: 1, textAlign: "center", marginRight: "8%" },
          ]}
          accessibilityRole="header"
          accessible={true}
        >
          {name}
        </Text>
      </View>
      <WebView
        source={{ uri: url }}
        style={{ marginTop: 0 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        // Injecting Javascript to remove header, chat etc
        injectedJavaScript={jscode}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            color="black"
            size="large"
            style={styles.flexContainer}
          />
        )}
        onMessage={(event) => {
          var msg = event.nativeEvent.data;
        }}
        onLoadEnd={(syntheticEvent) => {}}
        ref={webviewRef}
        onNavigationStateChange={(navState) => {
          console.log("current url on navigation state change:" + navState.url);
          setCanGoBack(navState.canGoBack);
          setCanGoForward(navState.canGoForward);
          setCurrentUrl(navState.url);
        }}
      />
      <View style={styles.tabBarContainer}>
        <TouchableOpacity
          accessibilityRole="button"
          accessible={true}
          disabled={!canGoBack}
          onPress={backButtonHandler}
        >
          {canGoBack ? (
            <Feather
              name="chevron-left"
              size={global.device == "2" ? 50 : 24}
              color="black"
            />
          ) : (
            <Feather
              name="chevron-left"
              size={global.device == "2" ? 50 : 24}
              color="gray"
            />
          )}
        </TouchableOpacity>
        <View style={styles.tabBarContainer2}>
          <TouchableOpacity
            accessibilityRole="button"
            accessible={true}
            disabled={!canGoForward}
            onPress={frontButtonHandler}
          >
            {canGoForward ? (
              <Feather
                name="chevron-right"
                size={global.device == "2" ? 50 : 24}
                color="black"
              />
            ) : (
              <Feather
                name="chevron-right"
                size={global.device == "2" ? 50 : 24}
                color="gray"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
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
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    marginRight: "15%",
  },
  backButton: { paddingHorizontal: "4%", marginTop: 10, marginBottom: 10 },
  tabBarContainer: {
    padding: 7,
    flexDirection: "row",
    paddingHorizontal: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#26374A",
  },
  tabBarContainer2: {
    padding: 0,
    paddingHorizontal: 25,
  },
});
export default ContactUs;
