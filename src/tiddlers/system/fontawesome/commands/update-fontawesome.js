/*\
title: $:/fontawesome/commands/update-fontawesome.js
type: application/javascript
module-type: command

The `update-fontawesome` command takes a locally downloaded
[[Font Awesome 5.x Free zip package|https://fontawesome.com/]]
and then extracts the WOFF font files as well as some CSS files
in order to update the FontAwesome plugin tiddlers.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";


// Declare the --update-fontawesome command that updates directly from a
// Font Awesome package. This package might be either in the local filesystem,
// or a download link may be given. Because of this feature, the command
// needs to be run asynchronously.
exports.info = {
	name: "update-fontawesome",
	synchronous: false
};

// Good Stuff(tm) we need.
if ($tw.node) {
	var fs = require("fs");
	var zip = require("adm-zip");
	var versioning = require("compare-versions");
	var url = require("url");
	var request = require("request-promise-native");
	var fa5dlinfo = require("../libs/fa5downloadinfo.js");
}

// Create a new command instance; besides the parameters which we've got
// handed over here is the callback which we need to call when we either
// succeeded or failed.
var Command = function(params, commander, callback) {
	this.params = params;
	this.commander = commander;
	this.callback = callback;
	this.logger = new $tw.utils.Logger("--" + exports.info.name, { colour: "purple" });
};

// Run the update command.
Command.prototype.execute = function() {
  var force = (this.params.length >= 1 && this.params[0] === "force");

	var wiki = this.commander.wiki;
 	var self = this;
	var fazip = null;

	fa5dlinfo.fontAwesome5PackageDownloadInfo(self.logger)
		.then(function(fa5pkginfo) {
			self.logger.log("downloading zip package...");
			return request.get({
				uri: fa5pkginfo.url,
				encoding: null // !!!IMPORTANT
			})
				.then(function(body) {
					self.logger.log("downloaded zip package, size:", body.length);
					fazip = new zip(body);

					// Autodetect the Font Awesome version from the package contents.
					// Yes, we also extracted the version information from the package
					// URL, but this time we rather prefer to use what really is inside
					// the package...
				  var faroot = fazip.getEntries()[0].entryName.split("/")[0];
				  if (!faroot.startsWith("fontawesome-")) {
				    return "invalid Font Awesome zip package: missing or invalid path root " + faroot;
				  }
				  var match = /^fontawesome-.*-(\d+\.\d+\.\d+)$/.exec(faroot);
				  if (match === null) {
				    return "cannot autodetect Font Awesome version from path root " + faroot;
				  }
				  var faversion = match[1];
				  self.logger.log("autodetected Font Awesome version in zip package:", faversion);

				  // Check if newer than plugin...
					var faplugin = wiki.getTiddler("$:/plugins/TheDiveO/FontAwesome")
				  var faversionplugin = faplugin.fields["fa-version"];
				  self.logger.log("current plugin Font Awesome version:", faversionplugin);
				  if (versioning(faversionplugin, faversion) >=  0 && !force) {
				    return "update not possible: zip package is older or equal to plugin";
				  }
					// Update plugin Font Awesome metadata info...
					var plugintiddler = new $tw.Tiddler(faplugin, {
						"fa-version": faversion
					});
					self.logger.log("updated plugin Font Awesome version info to:", faversion);
					wiki.addTiddler(plugintiddler);

				  // Embedd the Font Awesome font files...
				  // ...please note that we deal with the free package only. If you need
				  // pro support, then please fork this project, make the necessary additions,
				  // and create a PR (pull request) -- do NOT check-in the FA pro font files or
				  // FA pro tiddlers to GitHub. Don't create PRs that contain FA pro fonts.
				  $tw.utils.each([
				      {
				        fontfile: "fa-brands-400",
				        fontfamily: "Font Awesome 5 Brands",
				        fontstyle: "normal",
				        fontweight: "normal",
				        cssclass: ".fab",
				        title: "Font Awesome 5 Free Brands"
				      }, {
				        fontfile: "fa-regular-400",
				        fontfamily: "Font Awesome 5 Free",
				        fontstyle: "normal",
				        fontweight: "400",
				        cssclass: ".far",
				        title: "Font Awesome 5 Free Regular"
				      }, {
				        fontfile: "fa-solid-900",
				        fontfamily: "Font Awesome 5 Free",
				        fontstyle: "normal",
				        fontweight: "900",
				        cssclass: ".fa, .fas",
				        title: "Font Awesome 5 Free Solid"
				      }
				    ], function(font) {
				      self.logger.log("extracting Font Awesome font file", font.fontfile + ".woff");
				      var woffname = faroot + "/web-fonts-with-css/webfonts/" + font.fontfile + ".woff";
				      var woff = fazip.readFile(woffname);
							if (woff === null) {
				        return "zip package misses WOFF web font file " + woffname;
				      }
				      var woffb64 = woff.toString("base64");
							self.logger.log("WOFF font binary size", Buffer.byteLength(woff),
								"/", "base64-encoded size", woffb64.length);
				      var text = "/* autoimported retrieved from '" + faroot + "' */\n";
							text += "@font-face {\n";
				      text += "  font-family: '" + font.fontfamily + "';\n";
				      text += "  font-style: " + font.fontstyle + ";\n";
				      text += "  font-weight: " + font.fontweight + ";\n";
				      text += "  src: url('data:application/font-woff;charset=utf-8;base64,"
				        + woffb64 + "') format('woff');\n";
				      text += "}\n\n";
				      text += font.cssclass + " {\n";
				      text += "  font-family: '" + font.fontfamily + "';\n";
				      text += "  font-style: " + font.fontstyle + ";\n";
				      text += "  font-weight: " + font.fontweight + ";\n";
				      text += "}\n";

				      var fontcsstiddler = new $tw.Tiddler({
				        title: "$:/plugins/TheDiveO/FontAwesome/fonts/" + font.title + ".css",
				        type: "text/css",
				        tags: "$:/tags/Stylesheet",
				        text : text
				      });
				      wiki.addTiddler(fontcsstiddler);
				  });

					// Retrieve the Font Awesome CSS file containing all the nifty
					// class definitions...
					self.logger.log("updating plugin styles/fontawesome 5.css");
					var fa5css = fazip.readAsText(faroot + "/web-fonts-with-css/css/fontawesome.css");
					if (fa5css === null) {
						return "zip package misses fontawesome.css file";
					}
					var csstiddler = new $tw.Tiddler({
						title: "$:/plugins/TheDiveO/FontAwesome/styles/fontawesome 5.css",
						type: "text/css",
						tags: "$:/tags/Stylesheet",
						text: "/* autoimported from '" + faroot + "' */\n"
							+ fa5css
					});
					wiki.addTiddler(csstiddler);

					// Now import the glyph metadata...
					self.logger.log("updating glyph metadata");
					var faiconmetadata = fazip.readAsText(faroot + "/advanced-options/metadata/icons.json");
					if (faiconmetadata === null) {
						return "zip package misses icons.json file";
					}
					var glyphmd;
				  try {
				    glyphmd = JSON.parse(faiconmetadata);
				  } catch(ex) {
				    return "invalid icons.json metadata file: " + ex.message;
				  }

				  // Each glyph/icon gets its own top-level property. We use this for the
				  // data tiddler title.
				  var glyphs = 0;
				  var fontclassenames = {
				    "brands": "fab",
				    "solid": "fas",
				    "regular": "far"
				  };
				  $tw.utils.each(glyphmd, function(glyph, glyphid) {
				    ++glyphs;

				    // Derive the default CSS class to use for a given glyph/icon...
				    var defaultstyle = fontclassenames[glyph["styles"][0]];

				    // Which font variants are available...?
				    var fontcssclasses = [];
				    $tw.utils.each(glyph["styles"], function(style) {
				      fontcssclasses.push(fontclassenames[style]);
				    });

				    // Knock together suitable (search) tags...
				    var terms = glyph["search"]["terms"];
				    terms.push.apply(terms, glyph["styles"]);

				    // We can finally create the glyp metadata tiddler.
				    var tiddler = new $tw.Tiddler({
				      // ...standard tiddler fields
				      "title": "$:/fontawesome/glyph/" + glyphid,
				      "tags": $tw.utils.stringifyList(terms),
				      "text": "<i class='" + defaultstyle + " fa-" + glyphid + " fa-10x'></i>",

				      // ...additional Font Awesome related fields
				      "fa-unicode": glyph["unicode"],
				      "fa-label": glyph["label"],
				      "fa-styles": $tw.utils.stringifyList(glyph["styles"]),
				      "fa-style-classes": fontcssclasses.join(" "),
				      "fa-default-style": defaultstyle
				    });
				    $tw.wiki.addTiddler(tiddler);
				  });

				  self.logger.log("imported", glyphs, "glyphs");

				  self.logger.log("...update succeeded; plugin Font Awesome upgraded to version:", faversion);
				})
				.catch(function(err) {
					self.logger.alert("Downloading the zip package didn't work.", err);
				})
				;
		})
		.catch(function(err) {
			self.logger.alert("failed to retrieve download package information:", err);
		})
		.then(function() {
			self.logger.log("command finished.");
			self.callback();
		})
		;
	return;
};

// Finally export the constructor function for this command.
exports.Command = Command;

})();
