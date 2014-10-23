var express = require('express'),
	connect = require('connect'),
	session = require('cookie-session'),
	bodyParser = require('body-parser'),
	serveStatic = require('serve-static');


var app = express();

app.use(session({
	keys : ['secret1', 'secret2']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(serveStatic('../public'));

app.listen(8080, function() {
	console.log('Server running at 8080 port');
});