/** @format */

import i18n from "./resources.js";
global.indicator = 1;
global.init = 0;
global.zoom = 1;
global.bold = true;
global.colorScheme="light";
global.theme = 0; //0:auto, 1:light, 2:dark
global.device = "1"; //1:phone,2:tablet
global.categories = []; //key,eng,fre
global.navigationIndicator = 0;
global.prevNavigateRoute = "";
global.subjectItems = []; //key,eng,fre,value,value1,   date    //add date,   date is the last retrieved datetime,   Keep in memory, generated every launch time
global.subjects = []; //key,value,date   //add date,   date is the last retrieved datetime,    keep in storage, only saving value==true
global.notifications = []; //id,title_en,title_fr,published_date,subject_id,readFlag    //Nouse
//Manage notification settings
global.inAppNotification = true;
global.pushNotification = true;
global.numberOfNotification = 1;
global.subjectNotificationType = true;
global.eventNotificationType = false; //No use
global.announcementNotificationType = false; //No use
global.dataReleaseNotificationType = false; //No use
global.notificationReadAll = true; //for red dot in home screen
//global.readFlag = []; //no use,replaced by notificationItem.readFlag
global.notificationPrevDatetime = null;
global.notificationCurrentDatetime = null;
global.notificationRetrieveInterval = 0; //8 hours
global.highlights = []; //id,titleE,titleF,image,imageLabelE,imageLabelF,date,categoryId,readFlag   //all the highlights for 30 days
//Alpha server
// global.pubApiUrlBase = "https://sdr-daily-alpha.cloud.statcan.ca/o1/api/plus/"; //https://sdr-daily.dev.cloud.statcan.ca/api/statcanplus/';   //for alpha: https://sdr-daily-alpha.cloud.statcan.ca/api/statcanplus/
// global.pubApiUrlBaseEn = "https://sdr-daily-alpha.cloud.statcan.ca/o1/en/api/plus/";
// global.pubApiUrlBaseFr = "https://sdr-daily-alpha.cloud.statcan.ca/o1/fr/api/plus/";

//Prod server
global.pubApiUrlBase = "https://www.statcan.gc.ca/o1/api/plus/";
global.pubApiUrlBaseEn = "https://www.statcan.gc.ca/o1/en/api/plus/";
global.pubApiUrlBaseFr = "https://www.statcan.gc.ca/o1/fr/api/plus/";


global.mockup = false;

//global.savedItemsE = [];  //to be deleted
//global.savedItemsF = []; //id //to be deleted

global.savedItems = []; //id
global.recentSearchesE = [];
global.recentSearchesF = []; //string//string
global.publicationPrevDatetime = null; //last time to get publications page=0
global.publicationLatestDatetime = null; //last time to calculate the latest
global.publications = []; //id,title,date,categoryId,image,imageLabel,summary// temporary use only, not saved
global.publicationVersion = "en-CA";
global.searchVersion = "en-CA";
global.followingVersion = "en-CA";

global.publicationRetrieveInterval = 8; //8 hours
global.maxPage = 10; //page limit for article api
global.articleId = 0; //Test only
global.maxNotificationArticle = 25; //the num for keeping the notification articles
global.notificationItems = []; //{id,title_en,title_fr,published_date,subject_id,readFlag}
global.followingsDirty = false;
global.afterGet = false; //indicates whether notification is get
global.followingList = []; //Temp use
//for status bar
global.STYLES = ['dark-content', 'light-content'];
global.COLORS=["#F4F7FA","#151E29"];
global.COLORSIOS=["white","#151E29"];
global.screen="";global.subScreen="";
//global.appState='active';