"use strict";
var exec 			= require('child_process').exec;
var dependancies	= require('../scripts/dependancies.js');

module.exports = {
	dependancies: [],
	callback: null,
	/**
	 *
	 * @function install
	 * @desc Installs dependancies
	 * that are required before 
	 * scaffolding
	 *
	 */
	install: function(callback) {
		var el = this;
		el.dependancies = dependancies();
		var d = el.dependancies[0];
		console.log('Installing dependancies..please wait..');
		if(typeof callback == 'function') {
			el.callback = callback;
			el.installSingle(d);
		}
	},
	/**
	 *
	 * @function installSingle
	 * @desc Install single 
	 * dependancy
	 *
	 */
	installSingle: function(d) {
		var el = this;
		dependancies = el.dependancies;
		if(d) {
			if(dependancies.length > 0) {
				exec('npm install -g ' + d, 
					function(err, data) {
					if(!err) {
						var i = el.dependancies.indexOf(d);
						if(i != -1) {
							el.dependancies.splice(i, 1);
							var next = el.dependancies[0];
							el.installSingle(next);
						}
					}
				});
			}
		}
		else {
			el.callback();
		}
	}	
};