"use strict";
var fs			= require('fs');
var chalk 		= require('chalk');
var path 		= require('path');
var inquire 	= require('inquirer');

/**
 * @name ModuleExports
 * @desc Create Initial Setup
 * for creating a brand new 
 * aptitude app
 *
 */
module.exports = {
	/**
	 *
	 * @function sayHello
	 * @desc Print logo and 
	 * display directions
	 *
	 */
	sayHello: function() {
		fs.readFile('lib/logo/logo.txt', 'utf-8', 
			function(err, data) {
				if(err) { console.log(err); }
				var s = data.toString();
				var m = chalk.black.bgWhite(s);
				console.log(m);
			}
		);
		return false;
	},
	/**
	 *
	 * @function install
	 * @desc Installs dependancies
	 * that are required before 
	 * scaffolding
	 *
	 */
	install: function() {},
	/**
	 * 
	 * @function initialize
	 * @desc Prompt for initial
	 * setup requirements
	 * 
	 */
	initialize: function() {
		var specs = {};
		var m = [
		'What would you like your app named?'];
		var questions = [{
				type: 'input',
				name: 'projectName',
				message: m[0],
				default: 'aptitude-app'
			}];

		inquire.prompt(questions, function(a) {
			if(a) {
				var name = a.projectName;
			}
		});
		return false;
	},
	/**
	 * @function definePackage
	 *
	 *
	 *
	 */
	definePackage: function() {},
	/**
	 *
	 * @function createFolderStruct
	 *
	 *
	 */
	createFolderStruct: function(){}
};

