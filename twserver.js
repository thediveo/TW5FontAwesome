/*
   Run the TW5FontAwesome development TiddlyWiki server by simply running
   this Nodejs module. This module is wired up as the "main" module in the
   package metadata "package.json".
*/
var $tw = require("tiddlywiki").TiddlyWiki();
var args = "editions/develop --verbose --server 8080 $:/core/save/all text/plain text/html";
console.log("Booting TW:", args);
$tw.boot.argv = args.split(" ");
$tw.boot.boot();
