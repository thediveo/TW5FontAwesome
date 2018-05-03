/*\
title: $:/fontawesome/libs/fa5categories.js
type: application/javascript
module-type: library

Finds out the icon categories defined for Font Awesome 5.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Get the real AWESOME stuff ... a, erm, *headless* browser...
if ($tw.node) {
  var Phantom = require("phantom");
}


// Returns a promise to retrieve the Font Awesome 5 icon
// categories.
exports.fontAwesome5Categories = function(logger) {
  return new Promise(function(resolve, reject) {

    var phantomBrowser;
    var fa5comIconsPage;
    var firstQuery = true;
    var fa5Categories;
    var catsPromResolve;
    var catsPromise = new Promise(function(resolve) { catsPromResolve = resolve; });

    // Retrieve the Font Awesome icon categories information from the
    // Font Awesome backend. The required API URL has been discovered
    // from the Font Awesome icons web page.
    function getCategories(url) {
      phantomBrowser.createPage()
        .then(function apiPageCreated(apiPage) {
          logger.log("Fetching icon categories...");
          apiPage.open(url, {
            operation: "POST",
            encoding: "utf8",
            headers: {
              "Accept": "application/json",
              "content-type": "application/x-www-form-urlencoded",
              "Origin": "https://fontawesome.com",
            },
            data: '{"params":"query=*&hitsPerPage=1000&page=0&facetFilters=%5B%5B%22type%3Acategory%22%5D%5D"}'
          })
          .then(function postStatus(status) {
            if (status !== "success") {
              logger.log("Cannot fetch icon categories: POST failed");
            }
            return apiPage.property('plainText');
          })
          .then(function content(response) {
            if (response) {
              fa5Categories = JSON.parse(response).hits;
            }
            return apiPage.close();
          })
          // The page for POSTing is closed, so we can now finally
          // resolve the pending categories promise. The result is
          // a categories array.
          .then(function() {
            catsPromResolve(fa5Categories);
          })
          .catch(function(err) {
            logger.log("Cannot fetch icon categories:", err);
            catsPromResolve(null);
          })
          ;
        })
        ;
    };

    // Load the Font Awesome 5 icon web page and find the categories
    // query API URL.
    Phantom.create()
      // Phantom headless webbrowser created: create a new page ("tab").
      .then(function phantomWebbrowserCreated(browser) {
        phantomBrowser = browser;
        return phantomBrowser.createPage();
      })
      // New page ("tab") created: open the icons page, and at the same
      // time monitor any resources requested by that page for the URL
      // of the icon categories query API. If we found that URL, we
      // then query the icon categories.
      .then(function openFontAwesomeWebpage(page) {
        logger.log("Fetching Font Awesome 5 icons page...")
        fa5comIconsPage = page;
        fa5comIconsPage.on("onResourceRequested", function(request) {
          if (firstQuery && request.method === "POST" &&
            /^https?:\/\/.*\.algolia\.net\/1\/indexes\/.*\/query\?/.test(request.url)) {
            firstQuery = false;
            getCategories(request.url);
          }
        });
        return fa5comIconsPage.open("https://fontawesome.com/icons");
      })
      // The icons web page has been loaded. We now wait for the
      // icon categories query to become fulfilled (or, resolved
      // in our specific case) ... well, we won't wait ourselves
      // but instead we return the categories data promise we
      // created early on and which the query function will resolve
      // after it got its query answered.
      .then(function pageStatus(status) {
        if (status !== "success") {
          logger.log("failed to load icon page fontawesome.com/icons");
        }
        return catsPromise;
      })
      // The promise for the icon categories has been fulfilled, so
      // we can now properly close the icon page. Doing this only after
      // the categories promise has been fulfilled, and not before,
      // is important: otherwise, we may end up in a race condition.
      .then(function categoriesFound(categories) {
        logger.log("Number of categories found:", categories.length);
        return fa5comIconsPage.close();
      })
      .catch(function(err) {
        logger.log("That didn't work:", err);
      })
      // Finally shut down the Phantom browser.
      .then(function() {
        if (phantomBrowser) {
          phantomBrowser.exit();
          phantomBrowser = null;
        }
        if (fa5Categories) {
          resolve(fa5Categories);
        } else {
          reject("could not retrieve Font Awesome 5 icon categories");
        }
      })
      ;
    })
    ;
}

})();
