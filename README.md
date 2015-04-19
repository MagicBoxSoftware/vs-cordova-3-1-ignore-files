# vs-cordova-3-1-ignore-files
Plugin removes unneeded files from VS Cordova Tools 3.1 packaging operation
## What is it?
In Visual Studio 2013 with *Visual Studio Tools for Apache Cordova CTP3.1* installed or Visual Studio 2015 CTP 6 the build or packaging operation for mobile hybrid apps includes **EVERYTHING** in your Visual Studio project in the resulting application package. This includes _references.js, packages.config and the template readme in addition to Typescript and unminified javascript files leading to code leakage and enormous useless bloat. Unlike other Visual Studio projects there is no built-in method for excluding files from the build at this time. Microsoft has assured us that as General Availability of VS 2015 approaches the situation will improve. For now this plugin will give you a great deal of control over which files land in your app package.
## Installation
1. Open \config.xml.
2. Click Custom tab.
3. Check Git.
4. Paste the URL of this repo https://github.com/MagicBoxSoftware/vs-cordova-3-1-ignore-files
5. Click the arrow button then click "Add" when it appears.
## Usage
The plugin consists of a default set of exclusions (`*.ts, *.nupkg, _references.js, packages.config and Project_Readme.html`) and 3 file types for specifying custom exclusions. Other than the default exclusions exclusions are only applied to build configurations other than *Debug*.
* **releaseignoreglobal.txt** - 1 file name or file pattern per line located in the project root.
  - Patterns included here are applied globally throughout the project. For example to remove all javascript source maps place `*.map` in the file. To remove *version.json* anywhere it appears in the project add a line with `version.json`. You cannot specify directories in this file.
* **releaseignore.txt** - 1 file name per line. The file must reside in the directory containing the listed files.
  * While subdirectory path syntax is permitted here it is not recommended. It is recommended to place another `releaseignore.txt` in the subdirectory. If path syntax is used use forward slashes with no leading slash (`subdir/filename.ext`).
  * Directories cannot be excluded in this file.
* **releaseignoredir.txt** - An empty file placed in the directory to be excluded.
  * **DOES NOT** perform a recursive exclusion. Only files in the same directory where the file is located will be excluded.
## Unminified javascript exclusion
Part of the default action is to exclude unminified javascript when a minified (`.min.js`) file by the same name exists in the same directory as the minified version. Many libraries such as Ionic and AngularJS Nuget packages include both the minified and unminified versions in the same directory. Since the Cordova build packs both into app package this exclusion can reduce app package size by as much as half.
## Applies to
The plugin has been extensively tested in Visual Studio 2013 with *Visual Studio Tools for Apache Cordova CTP3.1* installed and Visual Studio 2015 CTP 6. It may, and should, work with earlier Cordova tools builds, but is not guaranteed.

The plugin will be maintained through any further Cordova tools releases until the functionality is no longer needed.
## Credits
I would like to thank Chuck Lantz - https://github.com/Chuxel - of Microsoft who answered my Stack Overflow question http://stackoverflow.com/questions/29684190/visual-studio-cordova-exclude-files/29704705 by writing a Cordova plugin to remove Typescript files from the build -> https://github.com/Chuxel/taco-tricks/tree/master/plugin-remove-typescript .

It was from that example that this plugin was inspired.
### Other info
Another, more editorial, explanation of this plugin and its origins cane be found on our [web site](http://magicboxsoftware.com/visual-studio-cordova-tools-the-adventure-begins/).