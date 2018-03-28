/*
   Run the TW5FontAwesome development TiddlyWiki server by simply running
   this Nodejs module. This module is wired up as the "main" module in the
   package metadata "package.json".
*/
var $tw = require("tiddlywiki").TiddlyWiki();
if (process.argv.length > 2) {
  $tw.boot.argv = process.argv.slice(2);
} else {
  $tw.boot.argv = "editions/develop --verbose --server 8080 $:/core/save/all text/plain text/html".split(" ");
}
console.log("Booting TW:", $tw.boot.argv.join(" "));
$tw.boot.boot();
