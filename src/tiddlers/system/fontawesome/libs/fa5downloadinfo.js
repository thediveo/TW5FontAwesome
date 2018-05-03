/*\
title: $:/fontawesome/libs/fa5downloadinfo.js
type: application/javascript
module-type: library

Finds out the URL and current version of the Font Awesome 5 Free
download package, as offered as a download from fontawesome.com.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Get the real AWESOME stuff ... a, erm, *headless* browser...
if ($tw.node) {
  var Phantom = require("phantom");
}

// Returns a promise to retrieve the Font Awesome 5 Free package
// download information: the URL from which the package can be
// downloaded, as well as the package version (in "x.y.z" format).
exports.fontAwesome5PackageDownloadInfo = function(logger) {
  return new Promise(function(resolve, reject) {

    var phantomBrowser;
    var fa5comPage;

    // Download information about the Font Awesome 5 Free package
    // we're going to collect.
    var fa5PackageVersion;
    var fa5PackageUrl;

    Phantom.create()
      // Phantom headless webbrowser created...
      .then(function phantomWebbrowserCreated(browser) {
        phantomBrowser = browser;
        return phantomBrowser.createPage();
      })
      // New page ("tab") created...
      .then(function openFontAwesomeWebpage(page) {
        logger.log("Fetching Font Awesome 5 home page...")
        fa5comPage = page;
        return fa5comPage.open("https://fontawesome.com/");
      })
      // FA5 home page loading, but nothing more at this time...
      .then(function pageStatus(status) {
        if (status !== "success") {
          return Promise.reject("failed to load page fontawesome.com");
        }
        // While the home page has been loaded, it consists of a lot
        // of additional scripting and dynamic content creation. So
        // we now need to wait for the page to be finally completed,
        // before we can retrieve the FA5 package download URL.
        function checkPageCompleteExecutor(resolve, reject) {
          // Remember that evaluating a script injected into the
          // web page will be asynchronous, so we only get a promise
          // here at this time.
          fa5comPage.evaluate(function() {
            return document.readyState;
          })
          // The readyState retrieval promise was fulfilled, and we now
          // get the result from the script evaluation inside the web page:
          // which is the readyState of the web page.
          .then(function retrievedReadyState(readyState) {
            if (readyState === "complete") {
              resolve(readyState);
            } else {
              // Repeat the check some time later, and pass it the same
              // functions for resolving or rejecting the "page completed"
              // promise.
              setTimeout(checkPageCompleteExecutor, 500, resolve, reject);
            }
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
      // Phew, the FA5 home page finally is complete, with all the scripts
      // and dynamic stuff having been loaded and run to completion. Only
      // now we can start retrieving the FA5 package download URL...
      .then(function pageCompletelyLoaded(readyState) {
        logger.log("Font Awesome 5 home page completely loaded.");
          var url = fa5comPage.evaluate(function() {
            return document
              .querySelector("a[href^='https://use.fontawesome.com/releases/']")
              .href;
          });
          if (!url) {
            reject("Failed to locate release package download URL");
          }
          return url;
      })
      // We've got the FA5 package download URL: so we now can extract the
      // package version information from this URL.
      .then(function(downloadUrl) {
        fa5PackageUrl = downloadUrl;
        logger.log("Extracted Font Awesome 5 Free download URL:", fa5PackageUrl);
        fa5PackageVersion = /\/fontawesome-.*-(\d+\.\d+\.\d+)\.zip$/.exec(fa5PackageUrl)[1];
        logger.log("Extracted Font Awesome 5 Free version:", fa5PackageVersion);
        // We're done, so let's now clean up all those things not needed
        // anymore: we start by disposing the web page (tab)...
        return fa5comPage.close();
      })
      .then(function() {
        fa5comPage = null;
        return;
      })
      // Catch all that went wrong during the above sequence.
      .catch(function(err) {
        logger.log("That didn't work:", err);
      })
      // Ensure to always correctly get rid of the phantom web browser,
      // as otherwise it would keep running in the background ... and
      // our node instance wouldn't terminate by itself while the phantom
      // web browser is still running.
      /*finally*/
      .then(function() {
        if (phantomBrowser) {
          phantomBrowser.exit();
          phantomBrowser = null;
        }
        // Finally resolve or reject the overall FA5 package download
        // information retrieval promise...
        if (fa5PackageUrl && fa5PackageVersion) {
          resolve({
            url: fa5PackageUrl,
            version: fa5PackageVersion
          });
        } else {
          reject("could not retrieve Font Awesome 5 Free package download information");
        }
      })
      ;
    })
    ;
}

})();
