"use strict";
var fs				= require('fs');
var chalk 			= require('chalk');
var path 			= require('path');
var inquire 		= require('inquirer');
var questions 		= require('../scripts/questions.js');
var folders 		= require('../scripts/folders.js');
var files 			= require('../scripts/files.js');
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
	files: [],
	bar: null,
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
					el.files = files.files;
					el.createFolderStruct()
					.then(function() {
						el.createPackages()
						.then(function() {
							el.runSetupScripts()
							.then(function() {
								el.runScript('gulp build_all')
								.then(function() {
									el.showMessage("postinstall.txt")
									.then(function() {
										
									});
								});
							});
						})
					})
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
		var d = q.defer();
		var el = this;
		var f = folders.folders;
		for(var folder in f) {
			var fold = f[folder];
			el.mkdir(fold);
		}
		d.resolve(f);
		return d.promise;
	},
	/**
	 *
	 * @function readFile
	 *
	 */
	readFile: function(answers, file) {
		var d = q.defer();
		var temp = dir + "/lib/templates/" + file;
		var a = answers;
		fs.readFile(temp, 'utf-8', 
			function(err, data) {
				if(!err) {
					var t = data;
					for(var index in a) {
						var p = "__" + index + "__";
						t = t.split(p)
						.join(a[index]);
					}
					d.resolve(t);
				}
			}
		);
		return d.promise;
	},
	/**
	 *
	 * @function createPackages
	 * @desc creates the template
	 * package.json and bower.json
	 *
	 */
	createPackages: function() {
		var el = this;
		var d = q.defer();
		var len = el.files.length;
		var file = el.files[0];
		el.createTemplates(file);
		d.resolve(file);
		return d.promise;
	},
	/**
	 *
	 * @function createTemplates
	 *
	 */
	createTemplates: function(t) {
		var el = this;
		var files = el.files;
		var ans = el.answers;
		if(t) {
			if(files.length > 0) {
				var file = t;
				el.readFile(ans, file)
				.then(function(f) {
					if(f) {
						fs.writeFile(file, f, 
						function(err){
							if(!err) {
								var i = el.files.indexOf(file);
								if(i != -1) {
									el.files.splice(i, 1);
									var next = el.files[0];
									el.createTemplates(next);
								}
							}
						})
					}
				});
			}
		}
		else {
			return true;
		}
	},
	/**
	 * @function runSetupScripts
	 * 
	 *
	 */
	runSetupScripts: function() {
		var el = this;
		var defer = q.defer();
		var m = "    Please wait..";
		m += "Creating files and folders ";
		m += "[:bar] :percent";
		el.showMessage("preinstall.txt")
		.then(function() {
			el.bar = new progress(chalk.cyan(m), {
				total: 4
			});
			el.bar.tick();
			el.runScript("npm install")
			.then(function() {
				el.bar.tick();
				el.runScript("bower install")
				.then(function() {
					el.bar.tick();
					el.runScript("gulp build_bower")
					.then(function() {
						el.bar.tick();
						el.copyDocTemplates()
						.then(function() {
							defer.resolve('t');
						});
					});
				});
			});
		});
		return defer.promise;
	},
	/**
	 * @function runScript
	 * 
	 *
	 */
	runScript: function(script) {
		var defer = q.defer();
		exec(script, 
			function(err, d) {
				if(!err) {
					defer.resolve(d);
				}
			}
		)
		return defer.promise;
	},
	/**
	 *
	 * @function copyDocTemplates
	 *
	 */
	copyDocTemplates: function() {
		var d = q.defer();
		var el = this;
		var answers = el.answers;
		var tmpPath;
		tmpPath = "node_modules_tmp/angular-jsdoc/";
		tmpPath += "template/";
		var filePath = "node_modules/angular-jsdoc/template/";
		var files = ['static/styles/prettify-tomorrow-night.css',
		'tmpl/layout.tmpl', 'publish.js'];
		// TODO: 
		// clean this up!
		// too many callbacks
		el.readFile(answers, tmpPath + files[0])
		.then(function(f){
			if(f) {
				fs.writeFile(filePath + files[0], f, 
					function(err) {
					if(!err) {
						el.readFile(answers, tmpPath + files[1])
						.then(function(file) {
							if(file) {
								fs.writeFile(filePath + files[1], file, 
								function(err) {
									if(!err){
										el.readFile(answers, tmpPath + files[2]) 
										.then(function(f) {
											if(f) {
												fs.writeFile(filePath + files[2], f, function(err) {
													if(!err) {
														d.resolve('f');
													}
												});
											}
										});
									}
								});
							}
						});
					}
				});
			}
		})
		return d.promise;
	},
	/**
	 * 
	 * @function showMessage
	 *
	 *
	 */
	showMessage: function(p) {
		var d = q.defer();
		var file = dir + '/lib/messages/' + p;
		fs.readFile(file, 'utf-8', 
			function(err, data) {
				if(err) { console.log(err); }
				var s = data.toString();
				var m = chalk.cyan.bgBlack(s);
				console.log(m);
				d.resolve('t');
			}
		);
		return d.promise;
	}
};

