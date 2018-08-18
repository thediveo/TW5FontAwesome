/*\
title: $:/fontawesome/libs/fa5downloadinfo.js
type: application/javascript
module-type: library

Finds out the URL and current version of the Font Awesome 5 Free
download package, as offered by the project's GitHub repository.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Get the real AWESOME stuff ... a, erm, *headless* browser...
if ($tw.node) {
  var request = require("request-promise-native");
}

// Returns a promise to retrieve the Font Awesome 5 Free package
// download information: the URL from which the package can be
// downloaded, as well as the package version (in "x.y.z" format).
exports.fontAwesome5PackageDownloadInfo = function(logger) {
  // Ask the project's GitHub API for the latest and greatest release.
  logger.log("retrieving GitHub FortAwesome/Font-Awesome latest release data");
  return request.get({
    uri: "https://api.github.com/repos/FortAwesome/Font-Awesome/releases/latest",
    headers: {
      "User-Agent": "Awesome-Octocat-App ;)" 
    }
  })
  .then(function(body) {
    var latest = JSON.parse(body);
    var fa5url = null;
    $tw.utils.each(latest.assets, function(asset) {
      if (asset.browser_download_url.indexOf("-web.zip") >= 0) {
        fa5url = asset.browser_download_url;
      }
    });
    if (!fa5url) {
      return Promise.reject("failed to get latest release data; no asset download URL found.");
    }
    return fa5url;
  })
  .catch(function(err) {
    logger.alert("failed to retrieve latest release metadata:", err);
  })
  // We've got the FA5 package download URL: so we now can extract the
  // package version information from this URL.
  .then(function(fa5PackageUrl) {
    logger.log("Extracted Font Awesome 5 Free download URL:", fa5PackageUrl);
    var fa5PackageVersion = /\/fontawesome-.*-(\d+\.\d+\.\d+)-web\.zip$/.exec(fa5PackageUrl)[1];
    logger.log("Extracted Font Awesome 5 Free version:", fa5PackageVersion);
    return Promise.resolve({
      url: fa5PackageUrl,
      version: fa5PackageVersion
    });
  })
	;
}

})();
