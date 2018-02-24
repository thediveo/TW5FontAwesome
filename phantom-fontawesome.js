"use strict";

var Phantom = require("phantom");
var phantom;
var fa5com;

Phantom.create()
  .then(function phantomWebbrowserCreated(ph) {
    phantom = ph;
    return phantom.createPage();
  })
  .then(function openFontAwesomeWebpage(page) {
    console.log("Fetching Font Awesome 5 home page...")
    fa5com = page;
    return fa5com.open("https://fontawesome.com/");
  })
  .then(function pageStatus(status) {
    console.log("Status:", status);
    return fa5com.property("content");
  })
  .then(function contentReady(content) {
    console.log("Content ready.");

    function checkPageCompleteExecutor(resolve, reject) {
      // Remember that evaluating a script injected into the
      // web page will be asynchronous, so we only get a promise
      // here at this time.
      fa5com.evaluate(function() {
        return document.readyState;
      })
      // The promise was fulfilled, and we now get the result from
      // the script evaluation inside the web page: which is the
      // readyState of the web page.
      .then(function(readyState) {
        console.log("Checked:", readyState);
        if (readyState === "complete") {
          resolve(readyState);
        }
        setTimeout(checkPageCompleteExecutor, 500, resolve, reject);
      });
    };

    return new Promise(checkPageCompleteExecutor);
  })
  .then(function() {
    console.log("Page complete.");
    console.log("Closing page.");
    return fa5com.close();
  })
  .catch(function(err) {
    console.log("That didn't work:", err);
  })
  /*finally*/
  .then(function() {
    if (phantom) {
      phantom.exit();
    }
  })
  ;
