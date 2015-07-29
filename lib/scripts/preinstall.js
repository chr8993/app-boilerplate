"use strict";
var exec 			= require('child_process').exec;
var dependancies	= require('../scripts/dependancies.js');

module.exports = {
	dependancies: [],
	callback: null,
	bar: null,
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
		var m = "Installing dependancies..";
		m += "please wait..";
		console.log(m);
		if(typeof callback == 'function') {
			el.callback = callback;
			el.installProgress(d);
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
							el.bar.tick();
							el.installSingle(next);
						}
					}
				});
			}
		}
		else {
			el.callback();
		}
	},
	/**
	 * @function installProgress
	 * @desc Installs the progress
	 * plugin
	 */
	installProgress: function(d) {
		var el = this;
		var dep = el.dependancies;
		if(d) {
			var m = "npm install -g progress";
			exec(m, function(err, data) {
				if(!err) {
					var p = require('progress');
					var len =  dep.length;
					var s = "Installing [:bar] :percent";
					el.bar = new p(s, {
						total: len
					});
					el.installSingle(d);
				}
			});
		}
	}	
};