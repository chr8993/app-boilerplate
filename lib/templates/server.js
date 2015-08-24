var express = require('express');
var app 	= express();
var dir 	= __dirname + '/dist/';
app.use(express.static('dist'));
app.use("/docs", express.static('docs'));

//index.html
app.get('/', function(req, res) {
	res.sendFile(dir + 'views/layout.html');
});

var server = app.listen(80, function() {
	var host = server.address().address;
  	var port = server.address().port;
	console.log('Server listening at http://%s:%s', host, port);
});
