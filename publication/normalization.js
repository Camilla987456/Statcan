/** @format */

import {
  Dimensions,
  Platform,
  PixelRatio,
  StyleSheet,
  useColorScheme,
  Appearance,
  StatusBar,
} from "react-native";
import "./settings.js";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;
//const colorScheme = Appearance.getColorScheme(); //useColorScheme();

//const colorScheme=global.theme==1?'dark':'light';

export function commonFontWeight(isBold) {
  return global.bold ? { fontWeight: "bold" } : { fontWeight: "normal" };
}
export function commonBackground(theme) {
  return theme == 2
    ? { backgroundColor: "#151E29" }
    : theme == 1
    ? { backgroundColor: "#F4F7FA" }
    : global.colorScheme == "light"
    ? { backgroundColor: "#F4F7FA" }
    : { backgroundColor: "#151E29" };
}

export function commonMenuBackground(theme) {
  return theme == 2
    ? { backgroundColor: "#26374A" }
    : theme == 1
    ? { backgroundColor: "white" }
    : global.colorScheme == "light"
    ? { backgroundColor: "white" }
    : { backgroundColor: "#26374A" };
}

export function commonBackgroundSearch(theme) {
  return theme == 2
    ? { backgroundColor: "#26374A" }
    : theme == 1
    ? { backgroundColor: "#FFFFFF" }
    : global.colorScheme == "light"
    ? { backgroundColor: "#FFFFFF" }
    : { backgroundColor: "#26374A" };
}

export function commonBackgroundColor(theme) {
  return theme == 2
    ? "#151E29"
    : theme == 1
    ? "#F4F7FA"
    : global.colorScheme == "light"
    ? "#F4F7FA"
    : "#151E29";
}
export function commonSettingBackground(theme) {
  return theme == 2
    ? { backgroundColor: "#1A2636" }
    : theme == 1
    ? { backgroundColor: "white" }
    : global.colorScheme == "light"
    ? { backgroundColor: "white" }
    : { backgroundColor: "#1A2636" };
}
export function commonFrameBackground(theme) {
  return theme == 2
    ? { backgroundColor: "darkgray" }
    : theme == 1
    ? { backgroundColor: "white" }
    : global.colorScheme == "light"
    ? { backgroundColor: "white" }
    : { backgroundColor: "darkgray" };
}
export function commonBannerBackground(theme) {
  return theme == 2
    ? { backgroundColor: "darkgray" }
    : theme == 1
    ? { backgroundColor: "#E3E2E2" }
    : global.colorScheme == "light"
    ? { backgroundColor: "#E3E2E2" }
    : { backgroundColor: "darkgray" };
}
export function commonForeground(theme) {
  return theme == 2
    ? { color: "white" }
    : theme == 1
    ? { color: "#333333" }
    : global.colorScheme == "light"
    ? { color: "#333333" }
    : { color: "white" };
}
export function commonForegroundDes(theme) {
  return theme == 2
    ? { color: "white" }
    : theme == 1
    ? { color: "#333333" }
    : global.colorScheme == "light"
    ? { color: "#333333" }
    : { color: "white" };
}
export function commonTextButtonColor(theme){

  return theme == 2
    ? { 
  color: "#0078D7"  }
    : theme == 1
    ? { color: "#335075" }
    : global.colorScheme == "light"
    ? { color: "#335075"  }
    : {color: "#0078D7" 
    };
  }
    export function commonTextColor(theme){

      return theme == 2
        ? { 
      color: "white"  }
        : theme == 1
        ? { color: "#335075" }
        : global.colorScheme == "light"
        ? { color: "#335075"  }
        : {color: "white" 
        };
}
export function commonButton(theme) {
  return theme == 2
    ? { 
  backgroundColor: "#0078D7",
  shadowColor: "#24374F",  }
    : theme == 1
    ? { backgroundColor: "#335075", 
    shadowColor: "#DDDDDD",}
    : global.colorScheme == "light"
    ? { backgroundColor: "#335075",
    shadowColor: "#DDDDDD",  }
    : {backgroundColor: "#0078D7",
    shadowColor: "#24374F", 
    };
}
export function commonButtonColor(theme) {
  return theme == 2
    ? { 
  backgroundColor: "#0078D7",
  shadowColor: "#24374F",  }
    : theme == 1
    ? { backgroundColor: "#ffffff", 
    shadowColor: "#DDDDDD",}
    : global.colorScheme == "light"
    ? { backgroundColor: "#ffffff",
    shadowColor: "#DDDDDD",  }
    : {backgroundColor: "#0078D7",
    shadowColor: "#24374F", 
    };
}

export function commonForegroundSlider(theme) {
  return theme == 2
    ? { color: "white" }
    : theme == 1
    ? { color: "#3C3C4399" }
    : global.colorScheme == "light"
    ? { color: "#3C3C4399" }
    : { color: "white" };
}
export function commonForegroundLabel(theme) {
  return theme == 2
    ? { color: "white" }
    : theme == 1
    ? { color: "#707070" }
    : global.colorScheme == "light"
    ? { color: "#707070" }
    : { color: "white" };
}

export function commonIcons(theme) {
  return theme == 2
    ? { color: "#17B8FC" }
    : theme == 1
    ? { color: "#26374A" }
    : global.colorScheme == "light"
    ? { color: "#26374A" }
    : { color: "#17B8FC" };
}
export function commonForegroundColor(theme) {
  return theme == 2
    ? "white"
    : theme == 1
    ? "black"
    : global.colorScheme == "light"
    ? "black"
    : "white";
}

export function commonTabBarColor(theme) {
  return theme == 2
    ? "#F4F7FA"
    : theme == 1
    ? "#1C2939"
    : global.colorScheme == "light"
    ? "#1C2939"
    : "#F4F7FA";
}

export function commonForegroundHighlightColor(theme) {
  return theme == 2
    ? "#17B8FC"
    : theme == 1
    ? "#26374A"
    : global.colorScheme == "light"
    ? "#26374A"
    : "#17B8FC";
}
export function commonTabBarHighlightColor(theme) {
  return theme == 2
    ? "#17B8FC"
    : theme == 1
    ? "#26374A"
    : global.colorScheme == "light"
    ? "#26374A"
    : "#17B8FC";
}
export function commonBackgroundHighlightColor(theme) {
  return theme == 2
    ? "blue"
    : theme == 1
    ? "#26374A"
    : global.colorScheme == "light"
    ? "#26374A"
    : "blue";
}
export function commonBorder(theme) {
  return theme == 2
    ? { borderColor: "white" }
    : theme == 1
    ? { borderColor: "black" }
    : global.colorScheme == "light"
    ? { borderColor: "black" }
    : { borderColor: "white" };
}
export function commonCardBackground(theme) {
  return theme == 2
    ? { backgroundColor: "#29415C" }
    : theme == 1
    ? { backgroundColor: "white" }
    : global.colorScheme == "light"
    ? { backgroundColor: "white" }
    : { backgroundColor: "#29415C" };
}
export function commonSearchBackground(theme) {
  return theme == 2
    ? { backgroundColor: "#29415C" }
    : theme == 1
    ? { backgroundColor: "#7676801F" }
    : global.colorScheme == "light"
    ? { backgroundColor: "#7676801F" }
    : { backgroundColor: "#29415C" };
}

export function webviewTheme(theme) {
  const changeThemeD =
    'document.body.style.background = "black"; document.querySelectorAll("div.panel-body").forEach(e =>{ e.style.color = "white";e.style.backgroundColor = "black";});';
  const changeThemeL =
    'document.body.style.background = "white";document.querySelectorAll("div.panel-body").forEach(e =>{ e.style.color = "black";e.style.backgroundColor = "white";});';

  return theme == 2
    ? changeThemeD
    : theme == 1
    ? changeThemeL
    : global.colorScheme == "light"
    ? changeThemeL
    : changeThemeD;
}
export function followingTheme(theme) {
  const changeThemeD =
    'document.body.style.backgroundColor="black";document.querySelectorAll("details#all li,span,a,div").forEach(e =>{ e.style.color = "white";e.style.backgroundColor = "black";});';
  const changeThemeL =
    'document.body.style.backgroundColor="white";document.querySelectorAll("details#all li,span,a,div").forEach(e =>{ e.style.color = "black";e.style.backgroundColor = "white";});';

  return theme == 2
    ? changeThemeD
    : theme == 1
    ? changeThemeL
    : global.colorScheme == "light"
    ? changeThemeL
    : changeThemeD;
}
export function commonSize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
export function themeLiteral() {
  return theme == 2
    ? "dark"
    : theme == 1
    ? "light"
    : global.colorScheme == "light"
    ? "light"
    : "dark";
}
export function commonZoomSize(key, zoom) {
  let size = 24;
  switch (key) {
    case "mini":
      size = 12;
      break;
    case "small":
      size = 15;
      break;
    case "medium":
      size = 17;
      break;
    case "large":
      size = 20 * zoom;
      break;
    case "xlarge":
      size = 24;
      break;
    case "xelarge":
      size = 26;
      break;
    case "xxlarge":
      size = 30;
      break;
    default:
      size = 24;
      break;
  }
  const newSize = size * scale * zoom;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
export function CommonZoomStyle(key, zoom) {
  switch (key) {
    case "mini":
      return { fontSize: commonSize(11 * global.zoom) };
    case "mini1":
      return { fontSize: commonSize(8 * global.zoom) };
    case "mini2":
      return { fontSize: commonSize(10.5 * global.zoom) };
    case "mini3":
      return { fontSize: commonSize(6 * global.zoom) };
    case "mini4":
      return { fontSize: commonSize(5 * global.zoom) };
    case "mini5":
      return { fontSize: commonSize(4 * global.zoom) };
    case "small":
      return { fontSize: commonSize(14 * global.zoom) };
    case "small1":
      return { fontSize: commonSize(12 * global.zoom) };
    case "small4":
      return { fontSize: commonSize(15 * global.zoom) };
    case "small5":
      return { fontSize: commonSize(12 * global.zoom) };
    case "medium":
      return { fontSize: commonSize(17 * global.zoom) };
    case "mediumF1":
      return { fontSize: Math.min(commonSize(17 * global.zoom), 45) };
    case "mediumF2":
      return { fontSize: Math.min(commonSize(17 * global.zoom), 75) };
    case "large":
      return { fontSize: commonSize(20 * global.zoom) };
    case "xlarge":
      return { fontSize: commonSize(24 * global.zoom) };
    case "xxlarge":
      return { fontSize: commonSize(30 * global.zoom) };
    default:
      return { fontSize: commonSize(24 * global.zoom) };
  }
}
export function commonZoomSizeFix(key, zoom) {
  switch (key) {
    case "mini":
      return commonSize(11 * global.zoom);
    case "mini4":
      return commonSize(5 * global.zoom);
    case "small":
      return commonSize(15 * global.zoom);
    case "small4":
      return commonSize(15 * global.zoom);
    case "medium":
      return commonSize(17 * global.zoom);
    default:
      commonSize(24 * global.zoom);
  }
}
export function measureText(string, fontSize = 10) {
  const widths = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0.2796875, 0.2765625, 0.3546875, 0.5546875, 0.5546875,
    0.8890625, 0.665625, 0.190625, 0.3328125, 0.3328125, 0.3890625, 0.5828125,
    0.2765625, 0.3328125, 0.2765625, 0.3015625, 0.5546875, 0.5546875, 0.5546875,
    0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875,
    0.2765625, 0.2765625, 0.584375, 0.5828125, 0.584375, 0.5546875, 1.0140625,
    0.665625, 0.665625, 0.721875, 0.721875, 0.665625, 0.609375, 0.7765625,
    0.721875, 0.2765625, 0.5, 0.665625, 0.5546875, 0.8328125, 0.721875,
    0.7765625, 0.665625, 0.7765625, 0.721875, 0.665625, 0.609375, 0.721875,
    0.665625, 0.94375, 0.665625, 0.665625, 0.609375, 0.2765625, 0.3546875,
    0.2765625, 0.4765625, 0.5546875, 0.3328125, 0.5546875, 0.5546875, 0.5,
    0.5546875, 0.5546875, 0.2765625, 0.5546875, 0.5546875, 0.221875, 0.240625,
    0.5, 0.221875, 0.8328125, 0.5546875, 0.5546875, 0.5546875, 0.5546875,
    0.3328125, 0.5, 0.2765625, 0.5546875, 0.5, 0.721875, 0.5, 0.5, 0.5,
    0.3546875, 0.259375, 0.353125, 0.5890625,
  ];
  const avg = 0.5279276315789471;
  // console.log('arrly length:'+widths.length);
  return (
    string
      .split("")
      .map((c) =>
        c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg
      )
      .reduce((cur, acc) => acc + cur) * fontSize
  );
}
export function getMeasuredText(fs, txt, width, height) {
  let list = txt.split(" ");
  let index = 0;
  let sw = measureText(" ", fs);
  let text1 = "";
  let text2 = [];
  let row = 0;
  let tw = 0;
  let ww = measureText(list[index], fs);
  while (index < list.length) {
    //  console.log('index:'+index+' '+list[index]+' width:'+ww+' tw:'+tw+' row:'+row);
    if (tw + ww + sw >= width) {
      row++;
      if (row * (fs * 1.5) > 100) {
        return text1;
      }
      tw = 0;
    } else {
      tw += ww;
      text1 += " " + list[index];
      index++;
      ww = sw + measureText(list[index], fs);
    }
  }

  return text1;
}
export let CommonStyles = StyleSheet.create({
  //static style
  backgroundColor:
    global.colorScheme === "light"
      ? { backgroundColor: "#fff" }
      : { backgroundColor: "#242c40" },
  foregroundColor:
    global.colorScheme === "light" ? { color: "black" } : { color: "white" },

  container:
    global.colorScheme === "light"
      ? {
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
        }
      : {
          flex: 1,
          backgroundColor: "#242c40",
          alignItems: "center",
          justifyContent: "center",
        },
  label:
    global.colorScheme === "light"
      ? { color: "black", fontSize: commonSize(17) }
      : { color: "white", fontSize: commonSize(17) },
  safeArea: {
    flex: 1,
  },
  cardContainer: {
    overflow: "hidden",
    //  borderColor:'red',borderWidth:1,
    borderRadius: 10,
    marginTop: Platform.OS === "android" ? "0%" : "0%",
    marginBottom: 8, // Platform.OS === "android" ? "3%" : "2%",
  },
  cardViewSmall: {
    flexDirection: "row",
    minHeight: 100,
    marginBottom: 0,
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardViewBig: {}, //No use

  cardImageBig: {
    //  flex: 1,
    width: "100%",
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  tabHeaderContainer: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    elevation: 0,
    borderColor: "#CCD1D7",
  },
  tabHeaderContainerLandscape: {
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
    paddingTop:'3%'
  },
  tabHeaderTitle: {
    paddingVertical: "3%",
    marginLeft: "4%",
    textAlign: "left",
  },
  tabHeaderTitleLandscape: {
    paddingVertical: "2%",
    marginLeft: "4%",
    textAlign: "left",
    marginTop: Platform.OS == "android" ? "-2%" : "-6%",
  },
  miniFont: { fontSize: commonSize(12) },
  smallFont: { fontSize: commonSize(15) },
  mediumFont: { fontSize: commonSize(17) },
  largeFont: { fontSize: commonSize(20) },
  xlargeFont: { fontSize: commonZoomSize(24, global.zoom) },
  xxlargeFont: { fontSize: commonSize(30) },
  tapSpot: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
