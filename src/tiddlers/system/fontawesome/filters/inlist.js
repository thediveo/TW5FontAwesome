/*\
created: 20180103142516447
type: application/javascript
title: $:/fontawesome/filters/inlist
modified: 20180303172701217
module-type: filteroperator

purpose: filters input titles by a list of titles.

input: a selection of titles.
parameter: a list (selection) of titles.
output: new selection of only those titles that
  were in the input selection and the parameter
  selection.

\*/
(function(){

"use strict";

exports.inlist = function(source, operator, options) {
  var list = $tw.utils.parseStringArray(operator.operand);
  var results = [];
  source(function(tiddler, title) {
    if (list.indexOf(title) >= 0) {
      results.push(title);
    }
  })
  return results;
};

})();
