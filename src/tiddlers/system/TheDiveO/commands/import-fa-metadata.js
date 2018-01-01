/*\
title: $:/TheDiveO/commands/import-fa-metadata.js
type: application/javascript
module-type: command

The import-fa-metadata command imports glyph metadata from
a Font Awesome 5.0+ source package and creates a set of
glyph metadata tiddlers:
-- import-fa-metadata <path/to/icons.json>

The required icons.json file is to be found inside a Font
Awesome 5.0+ source package in the subfolder named
advanced-options/metadata.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.info = {
	name: "import-fa-metadata",
	synchronous: true
};

var Command = function(params, commander) {
	this.params = params;
	this.commander = commander;
	this.logger = new $tw.utils.Logger("--" + exports.info.name);
};

Command.prototype.execute = function() {
	if(this.params.length < 1) {
		return "Missing Font Awesome metadata file name";
	}
	var wiki = this.commander.wiki,
		self = this,
		fs = require("fs"),
		faIconMetadataFilename = this.params[0];

	self.logger.log("importing Font Awesome icon metadata from", faIconMetadataFilename);

  // Try to read the Font Awesome glyph metadata, which should be in JSON
  // format.
  var glyphmd;
  try {
    glyphmd = JSON.parse(fs.readFileSync(faIconMetadataFilename));
  } catch(ex) {
    return "cannot import metadata: " + ex.message;
  }

  // Each glyph/icon gets its own top-level property. We use this for the
  // data tiddler title.
  var glyphs = 0;
  $tw.utils.each(glyphmd, function(glyph, glyphid) {
    ++glyphs;

    // Derive the default CSS class to use for a given glyph/icon...
    var defaultstyle = {
      "brands": "fab",
      "solid": "fas",
      "regular": "far"
    }[glyph["styles"][0]];

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
      "fa-default-style": defaultstyle
    });
    $tw.wiki.addTiddler(tiddler);
  });

  self.logger.log("imported", glyphs, "glyphs");
	return null; // done & okay
};

exports.Command = Command;

})();
