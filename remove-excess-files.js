/*
  Copyright 2015 Magic Box Software. All rights reserved.  
  Licensed under the MIT license. 
*/
module.exports = function (context) {

    var fs = require("fs");
    var glob = context.requireCordovaModule('glob');

//Pattern to be removed globally every time the app is built
	var remPatterns = ["*.ts", "*.nupkg", "_references.js", "packages.config", "Project_Readme.html"];
	var isRelease = false;
	
//If this is not a debug build we may not need some files
	if(context.cmdLine.indexOf('configuration Debug') === -1){
		remPatterns.push("releaseignore*");
		isRelease = true;
	}

//Anchor to platform root
    context.opts.cordova.platforms.forEach(function(platform) {
		//Platform www directory path
		var pwww = "platforms/" + platform + "/assets/www/";
		
	//Remove unminified js and css if minified exists.
		jsCssPattern = "@(*.css|*.js)";
		glob(pwww + "**/" + jsCssPattern, function(err, jsCssFiles) {
			if(err) throw err;
			deleteUnminifieds(fs, jsCssFiles);
		});
		
	//Get the global releaseignores - if exists - push members onto the default delete array
		if(fs.existsSync(pwww + "releaseignoreglobal.txt")){
			readFileToArray(fs, pwww, "releaseignoreglobal.txt").forEach(function(line){
				remPatterns.push(line);
			});
		//Delete this file to avoid confusion below
			console.log("Deleting " + pwww + "releaseignoreglobal.txt");
            fs.unlinkSync(pwww + "releaseignoreglobal.txt");
		}
		
	//Format final remove all patterns
		var globPatternBuilder = "@(";
		remPatterns.forEach(function(pattern){globPatternBuilder += pattern + "|";});
		globPatternBuilder += ")";
		var globPattern = globPatternBuilder.replace("|)", ")");
		
	// Remove globally all files matching the globPattern pattern
		glob(pwww + "**/" + globPattern, function(err, remFiles) {
            if(err) throw err;
			deleteMiscFiles(fs, remFiles, isRelease);
        });
	});
}

//Deletes all annecessary files and files identified in ignorereleaseXXX files
	function deleteMiscFiles(fs, remFiles, isRelease){
		remFiles.forEach(function(remFile) {
			//if this is a release handle dir level ignores as they pass by
			if(isRelease && remFile.indexOf("releaseignore") !== -1){
				if(remFile.indexOf("releaseignoredir") !== -1){
					deleteDir(fs, remFile);
					return;
				}else{
					deleteIgFiles(fs, remFile);
				}
			}
			console.log("--[Deleting misc] " + remFile);
			fs.unlinkSync(remFile);
		});
	}

//Deletes unminified js and css files if a minified version exists in the same directory
	function deleteUnminifieds(fs, jsCssFiles){
		jsCssFiles.forEach(function(jsCssFile){
			var ckMinFile;
			if(/.*[^\.min]\.js/i.test(jsCssFile)){ckMinFile = jsCssFile.replace(".js", ".min.js");}
			else if(/.*[^\.min]\.css/i.test(jsCssFile)){ckMinFile = jsCssFile.replace(".css", ".min.css");}
			else{return;}
			if(jsCssFiles.indexOf(ckMinFile) !== -1){
				console.log("--[Deleting unminified] " + jsCssFile);
				fs.unlinkSync(jsCssFile);
			};
		});
	}

//Generic method to delete an array of files
	function deleteArrayOfFiles(fs, filesArr, caption, targetDir, checkFilesExist){
		filesArr.forEach(function(file){
		var fileToDelete;
		if(typeof targetDir !== 'undefined' && targetDir){fileToDelete = targetDir + file;}else{fileToDelete = file;}
		if(typeof checkFilesExist !== 'undefined' && targetDir && !fs.existsSync(fileToDelete)){return;}
			console.log("--[" + caption + "] " + fileToDelete);
			fs.unlinkSync(fileToDelete);
		});
	}

//Deletes the files listed in a ignorerelease.txt file
	function deleteIgFiles(fs, igFile){
		var targetDir = igFile.replace("releaseignore.txt", "");
		deleteArrayOfFiles(fs, readFileToArray(fs, targetDir, "releaseignore.txt"), "Deleting ignore file", targetDir, true);
	}

//Deletes all files in the directory where a releaseignoredir.txt file exists
	function deleteDir(fs, igFile){
		var targetDir = igFile.replace("releaseignoredir.txt", "");
		var displayDirSrc = targetDir.split("/assets");
		fList = fs.readdirSync(targetDir);
		fList.forEach(function(file){
			console.log("--[Deleting dir "  + displayDirSrc[1] + "] -> "  + file);
			fs.unlinkSync(targetDir + file);
		});
	}

//Reads a file from the file system, splits the lines into an array and strips control characters
	function readFileToArray(fs, fPath, fName){
		var rawFile = fs.readFileSync(fPath + fName, "utf8");
		var retAry = [];
		var srcAry = rawFile.split("\n");
		srcAry.forEach(function(line){
			retAry.push(line.replace(/^\s+|\s+$/g, ''));
		});
		return retAry;
	}