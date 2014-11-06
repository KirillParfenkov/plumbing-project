var express = require('express'),
	connect = require('connect'),
	session = require('cookie-session'),
	bodyParser = require('body-parser'),
	serveStatic = require('serve-static'),
	ContentDao = require('./modules/content-dao'),
	mongoConnector = require('./modules/db/mongo-connector');



mongoConnector.connect();
var contentDao = new ContentDao( './config.json' );

var app = express();

app.use(session({
	keys : ['secret1', 'secret2']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(serveStatic('../public'));
app.use(serveStatic('../../Lynx/content/files'));

app.listen(8090, function() {
	console.log('Server running at 8090 port');
});

app.get('/api/contents/:id', function( req, res ) {
	contentDao.get( req.params.id, function( err, content, next ) {
		if ( err || !content) {
			res.json( 400, err ? err : { error : 'ContentNotExist' } );
		} else {
			res.json( 200, content );
		}
	});
});

app.get('/api/contents', function( req, res ) {
	contentDao.getList( function( err, contents ) {
		if ( err ) {
			res.json( 400, err );
		} else {
			res.json( 200, contents );
		}
	});
});