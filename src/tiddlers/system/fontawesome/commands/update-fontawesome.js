/*\
title: $:/fontawesome/commands/update-fontawesome.js
type: application/javascript
module-type: command

The `update-fontawesome` command tries to update this TW5FontAwesome
development wiki with the latest online version of Font Awesome 5.x.
Please note that you cannot update the TW5FontAwesome plugin inside
normal user wikis. Instead, this command is for proparation of a
plugin update release.

To update, run in a terminal/shell:

```bash
$ npm run update
```

Wait for the update process to be completed, and for the updates
to be synced back into your repository file tree. Then:

```bash
$ npm run release
```

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
	var fs = require("fs")
	var versioning = require("compare-versions");
	var yaml = require("js-yaml");
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

// Run the update command: it expects a module-local node module in
// node_modules/@fortawesome/fontawesome-free
Command.prototype.execute = function() {
	var force = (this.params.length >= 1 && this.params[0] === "force");
	
	var wiki = this.commander.wiki;
	var self = this;

	// Fetch the version of the currently locally installed fontawesome-free
	// package.
	var faroot = "node_modules/@fortawesome/fontawesome-free"
	var faversion = JSON.parse(
		fs.readFileSync(faroot + "/package.json"))["version"];
	self.logger.log("found local fontawesome-free module version:", faversion);

	// Check if node module is newer than our fa5 plugin in this tiddlywiki...
	var faplugin = wiki.getTiddler("$:/plugins/TheDiveO/FontAwesome");
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
	//
	// ...please note that we deal with the free package only. If you need
	// "pro" support, then please fork this project, make the necessary
	// additions, and create a PR (pull request) -- do NOT check-in the FA pro
	// font files or FA pro tiddlers to GitHub. Don't create PRs that contain
	// FA pro fonts.
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
		var woffname = faroot + "/webfonts/" + font.fontfile + ".woff";
		var woff;
		try {
			woff = fs.readFileSyncFile(woffname);
		} catch (err) {
			return "fontawesome module misses WOFF web font file " + woffname +
				"; error: " + err;
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

   	// Retrieve the Font Awesome CSS file containing all the nifty class
   	// definitions...
    self.logger.log("updating plugin styles/fontawesome 5.css");
	var fa5css;
	try {
		fa5css = fs.readFileSync(faroot + "/css/fontawesome.css").toString();
    } catch (err) {
        return "fontawesome module misses fontawesome.css file; error: " + err;
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
	var faiconmetadata;
	try {
		faiconmetadata = fs.readFileSync(faroot + "/metadata/icons.yml").toString();
	} catch (err) {
        return "fontawesome module lacks icons.yml file; error: " + err;
    }
    var glyphmd;
    try {
	    glyphmd = yaml.safeLoad(faiconmetadata);
    } catch (ex) {
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
		var terms = glyph["search"]["terms"] || [];
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

    // import class/category information
    self.logger.log("updating categories metadata");
	var facategoriesdata;
	try {
		facategoriesdata = fs.readFileSync(faroot + "/metadata/categories.yml").toString();
	} catch (err) {
        return "fontawesome module lacks categories.yml file; error: " + err;
    }
    var categories;
    try {
	    categories = yaml.safeLoad(facategoriesdata);
    } catch(ex) {
	    return "invalid icons.json metadata file: " + ex.message;
    }
    $tw.utils.each(categories, function(category, elementname) {
        self.logger.log("category:", category.label);
        var tiddler = new $tw.Tiddler({
            "title": "$:/fontawesome/class/" + elementname,
            "description": category.label,
            "text": category.icons.join("\r\n")
        });
        $tw.wiki.addTiddler(tiddler);
    });

    self.logger.log("...update succeeded; plugin Font Awesome upgraded to version:", faversion);

	self.logger.log("command finished.");
	self.callback();
	return;

};

// Finally export the constructor function for this command.
exports.Command = Command;

})();
