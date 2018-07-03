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
  var puppy = require("puppeteer");
}

// Returns a promise to retrieve the Font Awesome 5 Free package
// download information: the URL from which the package can be
// downloaded, as well as the package version (in "x.y.z" format).
exports.fontAwesome5PackageDownloadInfo = function(logger, nosandbox) {
  return new Promise(function(resolve, reject) {

    var puppyBrowser;
    var fa5comPage;

    // Download information about the Font Awesome 5 Free package
    // we're going to collect.
    var fa5PackageVersion;
    var fa5PackageUrl;

    var opts = {}
    if (nosandbox) {
      opts.args = ['--no-sandbox', '--disable-setuid-sandbox'];
    }
    puppy.launch(opts)
      // Chromium headless webbrowser created...
      .then(function webbrowserCreated(browser) {
        puppyBrowser = browser;
        return browser.newPage();
      })
      // New page ("tab") created...
      .then(function openFontAwesomeWebpage(page) {
        logger.log("Fetching Font Awesome 5 home page...")
        fa5comPage = page;
        return fa5comPage.goto("https://fontawesome.com/");
      })
      // FA5 home page loading, but nothing more at this time...
      .then(function pageResponse(response) {
        if (!response.ok()) {
          return Promise.reject("failed to load page fontawesome.com: status "
                                + response.status());
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
      .then(function wait(readyState) {
        if (readyState === "complete") {
          logger.log("Waiting for page to settle...");
          return new Promise(function(resolve, reject) {
            setTimeout(function() {
              logger.log("Settled.");
              resolve(readyState);
            }, 1000);
          });
        } else {
          return readyState;
        }
      })
      // Phew, the FA5 home page finally is complete, with all the scripts
      // and dynamic stuff having been loaded and run to completion. Only
      // now we can start retrieving the FA5 package download URL...
      .then(function pageCompletelyLoaded(readyState) {
        logger.log("Font Awesome 5 home page completely loaded, page status",
                   readyState);
        return fa5comPage.evaluate(function() {
          return document
            .querySelector("a[href^='https://use.fontawesome.com/releases/']")
              .href;
        });
      })
      .then(function urlDiscovered(url) {
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
        fa5PackageVersion = /\/fontawesome-.*-(\d+\.\d+\.\d+)-web\.zip$/.exec(fa5PackageUrl)[1];
        logger.log("Extracted Font Awesome 5 Free version:", fa5PackageVersion);
        // We're done, so let's now clean up all those things not needed
        // anymore.
        return puppyBrowser.close();
        puppyBrowser = null;
      })
      // Catch all that went wrong during the above sequence.
      .catch(function(err) {
        logger.log("That didn't work:", err);
      })
      .then(function() {
        // Finally resolve or reject the overall FA5 package download
        // information retrieval promise...
        logger.log("Returning package version and URL...")
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
