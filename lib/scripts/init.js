"use strict";
var fs				= require('fs');
var chalk 			= require('chalk');
var path 			= require('path');
var inquire 		= require('inquirer');
var questions 		= require('../scripts/questions.js');
var folders 		= require('../scripts/folders.js');
var dependancies	= require('../scripts/dependancies.js');
var q 				= require('q');
var shell 			= require('shelljs');
var exec 			= require('child_process').exec;
var progress		= require('progress');

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
		fs.readFile('lib/logo/logo.txt', 'utf-8', 
			function(err, data) {
				if(err) { console.log(err); }
				var s = data.toString();
				var m = chalk.black.bgCyan(s);
				console.log(m);
				var f = 'lib/logo/welcome.txt';
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
	 * @function install
	 * @desc Installs dependancies
	 * that are required before 
	 * scaffolding
	 *
	 */
	install: function() {
		
		var defer = q.defer();
		var d = dependancies();

		//install required dependancies
		var b = "Installing dependancies ";
		var s = "[:bar] :percent :etas";
		var len = d.length;
		var bar = new progress(b + s, {total: len});

		exec('npm install -g ' + d[0], 
			function(err, data) {
			if(!err) {
				bar.tick();
				exec('npm install -g ' + d[1], 
					function(err, data) {
						if(!err) {
							bar.tick();
							defer.resolve('');
						}
					}
				);
			}
		});

		return defer.promise;
	},
	/**
	 * 
	 * @function initialize
	 * @desc Prompt for initial
	 * setup requirements
	 * 
	 */
	initialize: function() {
		var el = this;
		// el.install()
		// 	.then(function(res) {
		// 	}
		// );
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

