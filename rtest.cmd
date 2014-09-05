@echo off
rem release.cmd
rem
rem generates release files:
rem   editions\release\output\thirdflow.html -- the plugin demo wiki
rem   editions\release\output\thirdflow.tid -- the plugin tiddler
rem
tiddlywiki ^
	editions\release ^
	--verbose ^
	--build rtest
rem	|| exit 1
