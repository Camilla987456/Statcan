/** @format */

import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  View,
  Text,
  Image,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Share,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";
import {
  CommonStyles,
  commonZoomSize,
  CommonZoomStyle,
  commonFontWeight,
  commonBackground,
  commonForeground,
  commonFrameBackground,
  commonBorder,
  commonForegroundColor,
  commonForegroundHighlightColor,
  commonIcons,
} from "../normalization.js";
import i18n from "../resources.js";
import { Ionicons, Feather } from "@expo/vector-icons";
const displaySpinner = () => {
  return (
    <View>
      <ActivityIndicator
        size="large"
        style={{ position: "absolute", top: "50%", left: "50%", zIndex: 20 }}
      />
    </View>
  );
};
const BrowseScreen = ({ route, navigation }) => {
  let { url } = route.params;
  if (url.includes("www150") || url.includes("WWW150")) {
    if (url.includes("?")) {
      url += "&cmp=sma";
    } else {
      url += "?cmp=sma";
    }
  }
//  global.prevNavigateRoute = "";
  console.log("url:============" + url);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const webviewRef = useRef(null);
  const backButtonHandler = () => {
    if (webviewRef.current) webviewRef.current.goBack();
    setCanGoBack(!canGoBack);
  };
  const frontButtonHandler = () => {
    if (webviewRef.current) webviewRef.current.goForward();
    setCanGoForward(!canGoForward);
  };
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: currentUrl,
      });
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
      //  alert(error.message);
      alert(i18n.t("internalErr"));
      console.log(error.message);
    }
  };
  return (
    <SafeAreaView style={[CommonStyles.safeArea, commonBackground(theme)]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          accessibilityRole="button"
          accessible={true}
          onPress={() => {
            navigation.goBack();
          }}
          accessibilityLabel={"Close button"}
        >
          <Ionicons
            name="close-outline"
            size={global.device == "2" ? 34 : 30}
            style={[
              {
                marginLeft: 10,
                paddingTop: 10,
                width: global.device == "2" ? 34 : 24,
              },
              commonIcons(theme),
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel="Share button"
          onPress={onShare}
        >
          <Ionicons
            name="share-social"
            size={global.device == "2" ? 34 : 24}
            style={[
              {
                marginHorizontal: 15,
                paddingTop: 12,
                width: global.device == "2" ? 34 : 24,
              },
              commonIcons(theme),
            ]}
          />
        </TouchableOpacity>
      </View>
      <WebView
        source={{ uri: url }} showsVerticalScrollIndicator={false}
        style={{ marginTop: 20 }}
        renderLoading={() => {
          return displaySpinner();
        }}
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
  button: {
    color: "black",
    fontSize: 24,
    marginVertical: 2,
    paddingVertical: 2,
  },
});

export default BrowseScreen;
