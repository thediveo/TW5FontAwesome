/*\
created: 20180103142516447
type: application/javascript
title: $:/fontawesome/filters/bytags
modified: 20180103142558093
module-type: filteroperator

Filter operator returning those tiddlers from the source
list that are tagged with at least one of the tags specified
in the operand (which is a tag list). If the operand (tags
list) is empty, then all tiddlers from the source are returned.

\*/
(function(){

"use strict";

exports.bytags = function(source, operator, options) {
  var tags = $tw.utils.parseStringArray(operator.operand);
  var results = [];

  if (tags.length === 0) {
    // When no tags to filter are given, then return all tiddlers in
    // the source tiddler list.
    source(function(tiddler, title) {
      results.push(title);
    });
  } else {
    // When one or more tags are given, return all those tiddlers from
    // the source that match at least one of the tags. This means
    // ORing the tags to test for -- and not ANDing as it happens with
    // the usual sequence of [tag[a]tag[b]].
    source(function(tiddler, title) {
      if (tiddler && tiddler.fields.tags) {
        for (var tagidx = 0, tagcount = tiddler.fields.tags.length;
          tagidx < tagcount;
          tagidx++) {
          if (tags.indexOf(tiddler.fields.tags[tagidx]) !== -1) {
            results.push(title);
          }
        }
      }
    });
  }

  return results;
};

})();
