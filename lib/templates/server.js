var express = require('express');
var app 	= express();
var dir 	= __dirname + '/dist/';
app.use(express.static('dist'));

//index.html
app.get('/', function(req, res) {
	res.sendFile(dir + 'views/index.html');
});

var server = app.listen(80, function() {
	var host = server.address().address;
  	var port = server.address().port;
	console.log('Server listening at http://%s:%s', host, port);
});
