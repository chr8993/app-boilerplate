"use strict";

var m = ['What would you like your project named?',
		'Who is the author?',
		'Project description?',
		'Version?',
		'Module?'];
module.exports = {
	questions: [
		{
			type: 'input',
			name: 'projectName',
			message: m[0],
			default: 'aptitude-app'
		}, {
			type: 'input',
			name: 'projectAuthor',
			message: m[1]
		}, {
			type: 'input',
			name: 'projectDesc',
			message: m[2]
		}, {
			type: 'input',
			name: 'projectVersion',
			message: m[3],
			default: '0.0.0'
		},
		{
			type: 'input',
			name: 'projectModule',
			message: m[4],
			default: 'app'
		}
	]
};