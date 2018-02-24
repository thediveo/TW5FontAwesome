"use strict";

var Phantom = require("phantom");
var phantomBrowser;
var fa5comPage;
var fa5version;

Phantom.create()
  .then(function phantomWebbrowserCreated(browser) {
    phantomBrowser = browser;
    return phantomBrowser.createPage();
  })
  .then(function openFontAwesomeWebpage(page) {
    console.log("Fetching Font Awesome 5 home page...")
    fa5comPage = page;
    return fa5comPage.open("https://fontawesome.com/");
  })
  .then(function pageStatus(status) {
    if (status !== "success") {
      return Promise.reject("failed to load page fontawesome.com");
    }
    return fa5comPage.property("content");
  })
  .then(function contentReady(content) {
    function checkPageCompleteExecutor(resolve, reject) {
      // Remember that evaluating a script injected into the
      // web page will be asynchronous, so we only get a promise
      // here at this time.
      fa5comPage.evaluate(function() {
        return document.readyState;
      })
      // The promise was fulfilled, and we now get the result from
      // the script evaluation inside the web page: which is the
      // readyState of the web page.
      .then(function retrievedReadyState(readyState) {
        if (readyState === "complete") {
          resolve(readyState);
        }
        setTimeout(checkPageCompleteExecutor, 500, resolve, reject);
      })
      // Argh! Node.js is slowly cranking up the temperature to
      // have all promise code not only handling the "good" case,
      // but also the "bad" case, that is: .catch().
      .catch(function() {
        reject("Failed to retrieve page's readyState");
      })
      ;
    };
    return new Promise(checkPageCompleteExecutor);
  })
  .then(function pageCompletelyLoaded(readyState) {
    console.log("Page completely loaded");
    try {
      return fa5comPage.evaluate(function() {
        return document
          .querySelector("a[href^='https://use.fontawesome.com/releases/']")
            .href;
      });
    } catch(err) {
      return Promise.reject("FAIL:" + err);
    }
  })
  .then(function(downloadUrl) {
    console.log("Font Awesome 5 Free download URL:", downloadUrl);
    fa5version = /free-(.*\..*\..*)\.zip$/.exec(downloadUrl)[1];
    console.log("Font Awesome 5 version:", fa5version);
    console.log("Closing page.");
    return fa5comPage.close();
  })
  .then(function() {
    console.log("Page closed.");
  })
  .catch(function(err) {
    console.log("That didn't work:", err);
  })
  /*finally*/
  .then(function() {
    if (phantomBrowser) {
      phantomBrowser.exit();
    }
  })
  ;
