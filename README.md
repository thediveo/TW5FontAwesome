# TW5FontAwesome

![TW5FontAwesome flag](fa-flag.png)

**TW5FontAwesome** supports embedding [Font Awesome](http://fortawesome.github.io/Font-Awesome/) in [TiddlyWiki 5](http://tiddlywiki.com).
There is no need to install this font into your operating system. The font is already embedded in this TiddlyWiki 5
customization instead, so nothing to install at all. Please see the demo for details on how to easily install Font
Awesome support into your existing TiddlyWiki 5 instances. It's basically a simple drag&amp;drop operation.

## Embedded Font Version & Attribution

Enclosed you'll find Font Awesome version 4.2.0. In particular, the WOFF web font file as well as the CSS definitions. Font Awesome is by Dave Gandy &ndash; [http://fontawesome.io](http://fontawesome.io).

## License

* The embedded web font file is licensed as [SIL OFL 1.1](http://scripts.sil.org/OFL).
* The embedded CSS code is licensed as [MIT License](http://opensource.org/licenses/mit-license.html).
* My contributions (by TheDiveO) that aren't part of a standard TiddlyWiki 5 distribution itself
(as available from the [TiddlyWiki](http://tiddlywiki.com) web site) are licensed as:
  * documentation is covered by [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/).
  * code (such as TiddlyWiki 5 macros, JavaScript, et cetera) and CSS definitions are covered by
the [MIT License](http://opensource.org/licenses/mit-license.html).

## The TW5FontAwesome Repository

So you're a developer: how do you use the contents of this repository? I'm glad you're asking. Actually, it's not too
difficult, at least after you've managed to correctly set up a TiddlyWiki 5 development environment &ndash; consisting
of Node.js and TiddlyWiki 5. This basic installation is well explained in [Getting Started &ndash;
Node.js](http://tiddlywiki.com/#GettingStarted%20-%20Node.js:[[GettingStarted%20-%20Node.js]]) and easy to do.

##### Important

**At this time there's unfortunately a little gotcha involved.
You'll need a TiddlyWiki 5 installation that also contains my ``hierarchicalfilesystem``
plugin if you plan to develop on a clone of this repository. Hopefully, this new plugin may be integrated into
the TiddlyWiki 5 core. See also [pull request #767](https://github.com/Jermolene/TiddlyWiki5/pull/767).**

1. If not done so, install Node.js and TW5 as explained in [Getting Started &ndash;
Node.js](http://tiddlywiki.com/#GettingStarted%20-%20Node.js:[[GettingStarted%20-%20Node.js]]). Make sure that
the ``hierarchicalfilesystem`` plugin is installed too, see my note above.
1. Next, clone this [``Tw5FontAwesome`` repository](https://github.com/TheDiveO/TW5FontAwesome.git)
to your local drive.
1. Then, open a terminal (well, terminal *window* ... these days) and change to the directory/folder **immediately above** the TW5FontAwesome repository clone.
1. Start a TiddlyWiki server instance with ``tiddlywiki FontAwesome --server``.
1. Visit [http://localhost:8080](http://localhost:8080) in your browser ... and you should see the TW5FontAwesome wiki. (Eek, IPv4 only at this time...)
1. Try editing and creating tiddlers. Please note that this will immediately synchronize with the repository files on your local drive.
1. Enjoy!

## Author

[TheDiveO on GitHub](https://github.com/TheDiveO)

## Post Scriptum

The project TW5FontAwesome emblem is made from the Font Awesome flag symbol and the TiddlyWiki 5 emblem.
