"use strict";
var fs				= require('fs');
var chalk 			= require('chalk');
var path 			= require('path');
var inquire 		= require('inquirer');
var questions 		= require('../scripts/questions.js');
var folders 		= require('../scripts/folders.js');
var q 				= require('q');
var shell 			= require('shelljs');
var exec 			= require('child_process').exec;
var progress		= require('progress');
var dir;

/**
 * @name ModuleExports
 * @desc Create Initial Setup
 * for creating a brand new 
 * aptitude app
 *
 */
module.exports = {
	answers: {},
	/**
	 *
	 * @function sayHello
	 * @desc Print logo and 
	 * display directions
	 *
	 */
	sayHello: function() {
		var d = q.defer();
		fs.readFile(dir + '/lib/logo/logo.txt', 'utf-8', 
			function(err, data) {
				if(err) { console.log(err); }
				var s = data.toString();
				var m = chalk.black.bgCyan(s);
				console.log(m);
				var f = dir + '/lib/logo/welcome.txt';
				fs.readFile(f, 'utf-8', 
					function(err, data) {
						if(err) { console.log(err); }
						var m = chalk.cyan.bgBlack(data);
						console.log(m);
						d.resolve('');
					}
				);
			}
		);
		return d.promise;
	},
	/**
	 * 
	 * @function initialize
	 * @desc Prompt for initial
	 * setup requirements
	 * 
	 */
	initialize: function(path) {
		var el = this;
		dir = path;
		el.sayHello()
		.then(function() {
			var q = questions.questions;
			inquire.prompt(q, function(a) {
				if(a) {
					el.answers = a;
					el.createFolderStruct();
				}
			});
		});
		return false;
	},
	/**
	 * 
	 * @function makeDir
	 *
	 */
	mkdir: function(path) {
		shell.mkdir('-p', path);
  		shell.chmod(755, path);
	},
	/**
	 *
	 * @function createFolderStruct
	 *
	 */
	createFolderStruct: function() {
		var el = this;
		var f = folders.folders;
		for(var folder in f) {
			var fold = f[folder];
			el.mkdir(fold);
		}
	},
	/**
	 *
	 * @function readFile
	 *
	 */
	readFile: function(answers, file) {
		var temp = "lib/templates/" + file;
		var q = answers;
		var t = fs.readFileSync(temp, 'utf-8');
		for(var index in q) {
			var p = "__" + index + "__";
			t = t.split(p).join(q[index]);
		}
		return t;
	}
};

