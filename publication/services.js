/** @format */

import NetInfo from "@react-native-community/netinfo";
import { AsyncStorage } from "react-native";
import i18n from "./resources.js";
export function checkConnection() {
  //  return false;   //Test
  return new Promise((resolve) => {
    NetInfo.fetch().then((state) => {
      //   console.log('Connection type', state.type);
      //   console.log('Is connected?', state.isConnected);
      //   alert('Connection type:'+ state.type+'->Is connected?'+state.isConnected);
      resolve(state.isConnected);
    });
  });
}
export function checkNotificationAvailability() {
  global.notifications = getNotificationItems();
  //  global.notificationReadAll = !global.notifications.some((x) => x.readFlag === false); //Github uat#27, no need do more check for each item,Why?
  //    console.log('Read all flag1111:',global.notificationReadAll);
}
export function getNotificationItems() {
  let list = [];
  if (global.subjectItems.length == 0 || global.highlights.length == 0)
    return list;
  for (let i = 0; i < global.highlights.length; i++) {
    var f = global.subjectItems.find(
      (x) => x.key == global.highlights[i].categoryId
    );
    if (f && f.value) list.push(global.highlights[i]);
  }
  global.notificationReadAll = !list.some((x) => x.readFlag === false); //Github uat#27, no need do more check for each item,Why?
  //   console.log('Read all flag22222:',global.notificationReadAll);
  return list;
}
async function getCategoriesLocale(url, index) {
  let categories = [];
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      for (const key of Object.keys(result.subjects)) {
        if (key.length < 3)
          if (index == 0)
            categories.push({ key: key, eng: result.subjects[key] });
          else categories.push({ key: key, fre: result.subjects[key] });
      }
      return categories;
    })
    .catch((error) => {
      console.warn("error", "www150 down");
      //   errorMsg(1);
      return categories;
    });
}
export async function getCategories() {
  //  return getSubjectListMockup();   // Test only
  let categories = [];
  let urlEng = "https://www150.statcan.gc.ca/n1/en/subjects.json";
  let urlFre = "https://www150.statcan.gc.ca/n1/fr/subjects.json";
  let categoryEng = await getCategoriesLocale(urlEng, 0);
  let categoryFre = await getCategoriesLocale(urlFre, 1);
  if (categoryEng.length == 0 || categoryFre.length == 0) {
    return categories;
  }
  for (let i = 0; i < categoryEng.length; i++) {
    categories.push({
      ...categoryEng[i],
      ...categoryFre.find((itmInner) => itmInner.key === categoryEng[i].key),
    });
  }
  return categories;
}

export function arrayGroupBy(list, key) {
  return list.reduce(function (group, x) {
    (group[x[key]] = group[x[key]] || []).push(x);
    return group;
  }, {});
}
export function decodeHtmlCharCodes(str) {
  return str.replace(/(&#(\d+);)/g, (match, capture, charCode) =>
    String.fromCharCode(charCode)
  );
}

export function convertDateCategory(d) {
//  console.log(d);
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
  let ds = d.split("-");
  if (i18n.isFrench()){
    if(parseInt(ds[2])==1)return `${parseInt(ds[2])} ${monthF[parseInt(ds[1]) - 1]} ${ds[0]}`;
    else return `${parseInt(ds[2])} ${monthF[parseInt(ds[1]) - 1]} ${ds[0]}`;
    }
  else return `${monthE[parseInt(ds[1]) - 1]} ${parseInt(ds[2])}, ${ds[0]}`;




 /* if (i18n.isFrench()){
      if(parseInt(ds[2])==1)return `${parseInt(ds[2])}ᵉʳ ${monthF[parseInt(ds[1]) - 1]} ${ds[0]}`;
      else return `${parseInt(ds[2])} ${monthF[parseInt(ds[1]) - 1]} ${ds[0]}`;
      }
    else return `${monthE[parseInt(ds[1]) - 1]} ${parseInt(ds[2])}, ${ds[0]}`;*/

}

function getSubjectListBackup() {
  return [
    { key: 10, eng: "Government", fre: "Gouvernement" },
    {
      key: 11,
      eng: "Income, pensions, spending and wealth",
      fre: "Revenu, pensions, dépenses et richesse",
    },
    { key: 12, eng: "International trade", fre: "Commerce international" },
    { key: 13, eng: "Health", fre: "Santé" },
    { key: 14, eng: "Labour", fre: "Travail" },
    { key: 15, eng: "Languages", fre: "Langues" },
    { key: 16, eng: "Manufacturing", fre: "Fabrication" },
    {
      key: 17,
      eng: "Population and demography",
      fre: "Population et démographie",
    },
    {
      key: 18,
      eng: "Prices and price indexes",
      fre: "Prix et indices des prix",
    },
    { key: 19, eng: "Statistical methods", fre: "Méthodes statistiques" },
    {
      key: 20,
      eng: "Retail and wholesale",
      fre: "Commerce de détail et de gros",
    },
    {
      key: 21,
      eng: "Business and consumer services and culture",
      fre: "Services aux entreprises et aux consommateurs et culture",
    },
    {
      key: 22,
      eng: "Digital economy and society",
      fre: "Économie et société numériques",
    },
    { key: 23, eng: "Transportation", fre: "Transport" },
    { key: 24, eng: "Travel and tourism", fre: "Voyages et tourisme" },
    { key: 25, eng: "Energy", fre: "Énergie" },
    { key: 26, eng: "Unknown26", fre: "Unknown26" },
    { key: 27, eng: "Science and technology", fre: "Sciences et technologie" },
    { key: 28, eng: "Unknown28", fre: "Unknown28" },
    { key: 29, eng: "Unknown29", fre: "Unknown29" },
    { key: 30, eng: "Unknown30", fre: "Unknown30" },
    { key: 31, eng: "Unknown31", fre: "Unknown31" },
    {
      key: 32,
      eng: "Agriculture and food",
      fre: "Agriculture et alimentation",
    },
    {
      key: 33,
      eng: "Business performance and ownership",
      fre: "Rendement des entreprises et propriété",
    },
    { key: 34, eng: "Construction", fre: "Construction" },
    { key: 35, eng: "Crime and justice", fre: "Crime et justice" },
    { key: 36, eng: "Economic accounts", fre: "Comptes économiques" },
    {
      key: 37,
      eng: "Education, training and learning",
      fre: "Éducation, formation et apprentissage",
    },
    { key: 38, eng: "Environment", fre: "Environnement" },
    {
      key: 39,
      eng: "Families, households and marital status",
      fre: "Familles, ménages et état matrimonial",
    },
    { key: 40, eng: "Unknown40", fre: "Unknown40" },
    { key: 41, eng: "Indigenous peoples", fre: "Peuples autochtones" },
    { key: 42, eng: "Children and youth", fre: "Enfants et jeunes" },
    {
      key: 43,
      eng: "Immigration and ethnocultural diversity",
      fre: "Immigration et diversité ethnoculturelle",
    },
    {
      key: 44,
      eng: "Older adults and population aging",
      fre: "Adultes âgés et vieillissement démographique",
    },
    { key: 45, eng: "Society and community", fre: "Société et communauté" },
    { key: 46, eng: "Housing", fre: "Logement" },
  ];
}
