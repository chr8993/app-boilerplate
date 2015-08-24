/**
 * @name Index
 * @ngdoc Routes
 * @memberof __projectModule__
 * 
 */
(function() {
	"use strict";

	angular.module('app')
		.config(function($stateProvider) { 
			var p = "/views/";
			$stateProvider
			.state("index", {
				url: "",
				templateUrl: p + 'index.html'
			}
		);
	});
})();