![Workflow Status](https://github.com/thediveo/TW5FontAwesome/workflows/Deploy%20TW5FontAwesome/badge.svg)

# TW5FontAwesome

![TW5FontAwesome flag](fa-flag.png)

**TW5FontAwesome** supports embedding [Font Awesome](http://fortawesome.github.io/Font-Awesome/) in [TiddlyWiki 5](http://tiddlywiki.com).
There is no need to install this font into your operating system. The font is already embedded in this TiddlyWiki 5
customization instead, so nothing to install at all. Please see the demo for details on how to easily install Font
Awesome support into your existing TiddlyWiki 5 instances. It's basically a simple drag&amp;drop operation.

## Embedded Font Version & Attribution

Enclosed you'll find Font Awesome version 5.x+. In particular, the WOFF web font file as well as the CSS definitions. Font Awesome is by Dave Gandy &ndash; [http://fontawesome.com](http://fontawesome.com).

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

### Repository Organisation

The repository is organized such that it allows you to both develop and maintain this plugin from
within TiddlyWiki 5 itself as well as packaging the plugin.

* ``src/`` folder &ndash; contains the tiddler sources in form of individual .tid files, as well as
any external files. All tiddlers are hierarchically organized within the famous ``tiddler/`` subfolder.
This folder acts as a **shared** TiddlyWiki 5 edition so it contains simply an empty ``tiddlywiki.info``
configuration file. Concrete edition configuration is done inside the specific editions in the
``editions/`` folder instead (see below).
  * ``tiddler/`` folder &ndash; contains all tiddler sources, organized in subfolders according to
the tiddler titles. Most stuff will be in the ``system/`` subfolder which represents "$:/".
* ``editions/`` folder &ndash; here you'll find the TiddlyWiki 5 server editions, in particular:
  * ``develop/`` folder & ndash; the TiddlyWiki 5 server edition for developing. This folder only
contains the ``tiddlywiki.info`` setup information that pulls in the required plugins. Otherwise, it
simply refers to the (shared) ``src/`` where the tiddlers actually get stored.
  * ``release/`` folder &ndash; used for releasing the TW5FontAwesome plugin. The primary difference
to the develop edition is that the TW5FontAwesome plugin is defined here explicitly as a plugin.
    * ``plugins/`` folder &ndash; contains the explicit plugin definitions.
      * ``TW5FontAwesome/`` folder &ndash; the plugin defition of the TW5FontAwesome plugin. Please
note that this definition aliases ``src/tiddlers/system/``.

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

This plugin project now includes my //Third Flow// plugin for easy development and release of
customization plugins. This helper plugin removes itself when the TW5FontAwesome demonstration
TiddlyWiki gets generated.

## Author

[TheDiveO on GitHub](https://github.com/TheDiveO)

## Post Scriptum

The project TW5FontAwesome emblem is made from the Font Awesome flag symbol and the TiddlyWiki 5 emblem.
