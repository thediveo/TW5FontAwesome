/*\
created: 20180103142516447
type: application/javascript
title: $:/fontawesome/filters/enlisttitlesfield
modified: 20180103142558093
module-type: filteroperator

purpose: enlist titles contained in certain fields (defaults to the "text"
field) of a selection of titles.

input: a selection of titles.
parameter: F = the name of a field; defaults to "text".
output: new selection of titles, enlisted from fields F of
  the input tiddlers. The output never contains the same
  title twice; instead, while enlisting titles, they are "dominantly
  appended" to the output.

\*/
(function(){

"use strict";

exports.enlisttitlesfield = function(source, operator, options) {
  var field = operator.operand || "text";
  var results = [];
  source(function(tiddler, title) {
    var enlist = $tw.utils.parseStringArray(tiddler.getFieldString(field));
    if (enlist) {
      $tw.utils.pushTop(results, enlist);
    }
  })
  return results;
};

})();
