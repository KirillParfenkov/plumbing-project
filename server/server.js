var express = require('express'),
	connect = require('connect'),
	session = require('cookie-session'),
	bodyParser = require('body-parser'),
	serveStatic = require('serve-static'),
	ContentDao = require('./modules/content-dao'),
	VariablesDao = require('./modules/variables-dao'),
	mongoConnector = require('./modules/db/mongo-connector'),
	EmailService = require('./services/email-service');

var emailService = new EmailService('./config.json');

mongoConnector.connect();
var contentDao = new ContentDao( './config.json' );
var variablesDao = new VariablesDao( './config.json' );

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

app.get('/api/variables', function( req, res ) {
	variablesDao.getList( function( err, variables ) {
		if ( err ) {
			res.json( 400, err );
		} else {
			res.json( 200, variables );
		}
	});
});

app.post( '/api/services/email', function(req, res) {

    var message = req.body.message,
    	username = req.body.username,
    	phone = req.body.phone,
    	email = req.body.email;

    emailService.sendMail({
        to : 'Kiryl.Parfiankou.Dev@gmail.com',
        subject : "Message from the parf.by",
        text : message,
        html : "<p>От: " + username + "</p><p>Номер телефона:" + phone + "</p><p>Email:" + email + "</p><p>" + message + "</p>"
    }, function( err ) {
        if ( err ) {
            console.log( err );
            res.json( 400, err);
        } else {
            res.json( 200, {});
        }
    });
});