var express = require('express'),
	connect = require('connect'),
	nconf = require('nconf'),
	mysql = require('mysql'),
	session = require('cookie-session'),
	bodyParser = require('body-parser'),
	serveStatic = require('serve-static'),
	crypto = require('crypto'),
	mc = require('mc'),
	UserDao = require('./modules/user-dao'),
	GlobalVariablesDao = require('./modules/globalVariables-dao-tmp'),
	VariablesDao = require('./modules/variables-dao'),
	ContentDao = require('./modules/content-dao'),
	DataLoader = require('./modules/data-loader'),
	ProfileDao = require('./modules/profile-dao'),
	EmailService = require('./services/email-service'),
	FileService = require('./services/file-service'),
	url = require('url'),
	formidable = require('formidable'),
	multiparty = require('connect-multiparty'),
	fs = require('fs'),
	mkpath = require('mkpath'),
	path = require('path'),
	async = require('async'),
	passport = require('passport'),
	methodOverride = require('method-override'),
	LocalStrategy = require('passport-local').Strategy,
	mongoConnector = require('./modules/db/mongo-connector');


var fileService = new FileService();

/*var emailService = new EmailService('./config.json');

emailService.sendMail({
	to : 'Kirill.Parfenkov@gmail.com',
	subject : "Server started",
	text : "server started",
	html : "<h1>Server started!</h1>"
}, function( err, info ) {
	if ( err ){
		console.log( err );	
	} else {
		console.log( 'Email service work!' );
		console.log( info );
	}
});*/

mongoConnector.connect();

var dataLoader = new DataLoader('./config.json');
dataLoader.initialize(function( err ) {
	console.log('dataLoader is ready!');
});

var userDao = new UserDao('./config.json');
var globalVariablesDao = new GlobalVariablesDao( './config.json' );
var variablesDao = new VariablesDao( './config.json' );
var contentDao = new ContentDao( './config.json' );
var profileDao = new ProfileDao( './config.json', 'content/permissionSets', false );
profileDao.initialize(function( err ) {
	if ( !err ) {
		console.log( 'profile-dao is ready!');
	} else {
		console.err( err );
	}
});

nconf.argv()
	.env()
	.file({file: './config.json'});

var client = new mc.Client('localhost', mc.Adapter.json);
client.connect( function( err ) {
	console.log('memchashed! port 11211');
});

var tabales = {};

var sessions = [];
var app = express();

function ensureAuthenticated( req, res, next ) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect( 302, '/login.html');
}

passport.use( new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function( email, password, done ) {

		var len = 256;
		var isCredNotReady = true;
		var sessionKey;

		userDao.authorize( email, password, function( err, loginUser ) {

			if ( err ) {
				return done( err );
			}

			if ( !loginUser ) {
				return done( null, false, { message: 'Incorrect credationls!' } );
			}

			return done( null, loginUser );
		});
	}
));

passport.serializeUser( function( user, done ) {

	var len = 256;
	var isCredNotReady = true;
	var sessionKey;

	while ( isCredNotReady ) {
		sessionKey = crypto.randomBytes(len).toString('hex');
		if ( sessions.indexOf(sessionKey) == -1 ) {
			isCredNotReady = false;
		}
	}

	sessions.push({id : sessionKey, user: user});

	done( null, sessionKey );
});

passport.deserializeUser( function( sessionKey, done ) {

	var sessionExist = false;
	var user;
	if ( sessionKey ) {
		for (var i = 0; i < sessions.length; i++) {
			if ( sessions[i].id == sessionKey ) {
				sessionExist = true;
				user = sessions[i].user;
				break;
			}
		}
	}

	if ( !sessionExist ) {
		done( null, false, { message: 'Incorrect credationls!' } );
	} else {
		done( null, user );
	}
});

app.use(session({
	keys : ['secret1', 'secret2']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(serveStatic('public'));

app.use(passport.initialize());
app.use(passport.session());
app.post('/login', passport.authenticate( 'local', { successRedirect: '/', failureRedirect: '/login.html' }));

app.use(ensureAuthenticated);
app.use(serveStatic('webapp'));
app.use(serveStatic('content/files'));


app.get( '/system/currentUser', function(req, res) {
	res.json( 200, req.user );
});

app.get( '/system/currentProfile', function(req, res) {
	profileDao.getProfileById( req.user.profile, function( err, profile ) {
		if ( err ) {
			res.json( 400, { error: err } );
		}
		res.json( 200, profile );
	});
	
});

app.get( '/system/permissionScheme', function( req, res ) {
	profileDao.getProfileScheme( function( err, scheme ) {
		if ( err ) {
			res.json( 400, { error: err } );
		}
		res.json( 200, scheme );
	});
});

app.get( '/system/getPermissionSets/:id', function( req, res) {
	profileDao.getPermissionSet( req.params.id, function( err, permissionSet ) {
		if ( err ) {
			res.json( 400, { error: err } );
		}
		res.json( 200, permissionSet );
	});
});

app.get( '/system/profiles/:id', function( req, res ) {
	profileDao.getProfileById( req.params.id, function( err, profile ) {
		if ( err ) {
			res.json( 400, { error: err } );
		}
		res.json( 200, profile );
	});
});

app.post('/system/profiles', function( req, res ) {
	profileDao.saveProfile( req.body, function( err, profile ) {
		if ( err ) {
			res.json( 400, {error: 'error'});
		} else {
			res.json( 200, profile );
		}
	});
});

app.get('/system/profiles', function( req, res ) {
	profileDao.getProfileList( function( err, profiles ) {
		if ( err ) {
			res.json( 400, {error: 'error'});
		} else {
			res.json( 200, profiles );
		}
	});
});

app.put('/system/profiles/:id', function( req, res ) {
	profileDao.saveProfile( req.body, function( err, profile ) {
		if ( err ) {
			res.json( 400, {error: 'error'} );
		} else {
			res.json( 200, profile );
		}
	});
});

app.post('/system/users', function( req, res ) {
	userDao.createUser({
		email : req.body.email,
		firstName : req.body.firstName,
		lastName : req.body.lastName,
		password : req.body.password,
		repPassword : req.body.repPassword,
		profile : req.body.profile
	}, function(err, user) {
		if (err) {
			res.json( 400, err );
		} else {
			res.json( 200, user );
		}
	});
});

app.post('/system/password', function( req, res ) {
    userDao.changePassword({
        id : req.body.id,
        password : req.body.password,
        repPassword : req.body.repPassword
    }, function( err ) {
        if ( err ) {
            res.json( 400, err );
        } else {
            res.json( 200, {} );
        }
    });
});


app.route('/services/contents')
	.post( function( req, res ) {
		contentDao.create( { name : req.body.name, body: req.body.body }, function( err, content, next ) {
			if ( err || !content) {
				res.json( 400, err ? err : { error : 'ContentNotExist' } );
			} else {
				res.redirect( 302, req.body._redirect + '/' + content._id );
			}
		});
	}).get( function( req, res ) {
		contentDao.getList( function( err, contents ) {
			if ( err ) {
				res.json( 400, err );
			} else {
				res.json( 200, contents );
			}
		});
	});
app.route('/services/contents/:id')
	.get(function( req, res ) {
		contentDao.get( req.params.id, function( err, content, next ) {
			if ( err || !content) {
				res.json( 400, err ? err : { error : 'ContentNotExist' } );
			} else {
				res.json( 200, content );
			}
		});
	}).put( function( req, res ) {
		contentDao.update( req.body, function( err, content ) {
			if ( err ) {
				res.json( 400, err );
			} else {
				res.redirect( 302, req.body._redirect);
			}
		});
	}).delete( function( req, res, next) {
		contentDao.delete( req.params.id, function( err ) {
			if ( err ) {
				res.json( 400, err );
			} else {
				res.json( 200, {});
			}
		});
	});


// START Variables Rest API
app.route('/services/variables')
	.get( function( req, res ) {
		variablesDao.getList( function( err, variables ) {
			if ( err ) {
				res.json( 400, err );
			} else {
				res.json( 200, variables );
			}
		});
	}).post( function( req, res ) {
		variablesDao.create( req.body, function( err, variable ) {
			if ( err ) {
				res.json( 400, err );
			} else {
				res.json( 200, variable );
			}
		});
	});

app.route('/services/variables/:id')
	.get( function( req, res) {
		variablesDao.get( req.params.id, function( err, variable ) {
			if ( err || !variable ) {
				res.json( 400, err ? err : { error : 'VariableNotExist' } );
			} else {
				res.json( 200, variable );
			}
		});
	}).put( function( req, res) {
		variablesDao.update( req.body, function( err, variable ) {
			if ( err ) {
				res.json( 400, err );
			} else {
				res.json( 200, variable );
			}
		});
	}).delete( function( req, res ) {
		variablesDao.delete( req.params.id, function( err ) {
			if ( err ) {
				res.json( 400, err );
			} else {
				res.json( 200, {});
			}
		});
	});
// END Variables Rest API

// START Global Variables Rest API
app.get( '/system/globalVariables', function( req, res ) {
	globalVariablesDao.getList( function( err, variables ) {
		if ( err ) {
			res.json( 400, err );
		} else {
			res.json( 200, variables );
		}
	});
});

app.get( '/system/globalVariables/:id', function( req, res) {
	globalVariablesDao.get( req.params.id, function( err, variable ) {
		if ( err || !variable ) {
			res.json( 400, err ? err : { error : 'VariableNotExist' } );
		} else {
			res.json( 200, variable );
		}
	});
});

app.post( '/system/globalVariables', function( req, res ) {
	globalVariablesDao.create( req.body, function( err, variable ) {
		if ( err ) {
			res.json( 400, err ? err : { error : 'VariableNotExist' } );
		} else {
			res.json( 200, variable );
		}
	});
});

app.put( '/system/globalVariables/:id', function( req, res) {
	globalVariablesDao.update( req.body, function( err, variable ) {
		if ( err ) {
			res.json( 400, err );
		} else {
			res.json( 200, variable );
		}
	});
});

app.delete( '/system/globalVariables/:id', function( req, res ) {
	globalVariablesDao.delete( req.params.id, function( err ) {
		if ( err ) {
			res.json( 400, err );
		} else {
			res.json( 200, {});
		}
	});
});
// END Global Variables Rest API

app.get('/logout', function(req, res) {

	var user = req.user;
	for( var i = 0; i < sessions.length; ++i ) {
		if ( sessions[i].user.id == user.id ) {
			sessions.splice(i, 1);
			break;
		}
	}
	res.redirect( 302, '/');
});

app.get('/visibleTabs', function(req, res) {

	var user = req.user;

	dataLoader.getVisibleTabs( user.profile, function( err, tabs ) {
		if ( err ) {
			res.json( 400, { error: 'SQL error' } );
		} else {
			res.json( 200, tabs );
		}
	});
});

app.get('/api/:table', function(req, res) {
	dataLoader.getObjects( req.params.table, function( err, rows) {
		if (err) {
			res.json( 400, { error: 'SQL error' });
		} else {
			res.json( 200, rows );
		}
	});
});

app.post('/api/:table', function(req, res) {
	var row = req.body;
	dataLoader.postObject( req.params.table, req.body, function( err, result ) {
		if (err) {
			res.json(400, {error: 'SQL error'});
		} else {
			res.json( 200, result );
		}
	});
});

app.get('/api/:table/:id', function(req, res) {
	dataLoader.getObject( req.params.table, req.params.id, function( err, row, fields) {
		if (err) {
			res.json( 400, { error: 'SQL error' });
		} else {
			res.json( 200, row);
		}
	});
});

app.put('/api/:table/:id', function(req, res) {
	dataLoader.putObject( req.params.table, req.body, req.params.id, function( err, row ) {
		if ( err ) {
			res.json( 400, {error: 'SQL error'} );
		} else {
			res.json( 200, row );
		}
	});
});

app.delete('/api/:table/:id', function(req, res) {
	dataLoader.deleteObject( req.params.table, req.params.id, function( err, result ) {
		if ( err ) {
			res.json( 400, {error: 'SQL error'} );
		} else {
			res.json( 200, result );
		}
	});
});

app.get('/files', function( req, res ) {
	fileService.getFiles( req.query.id, function( err, files ) {
		if ( err ) {
			console.log( err );
			res.json( 400, err );
		} else {
			res.json( 200, files );
		}
	});
});


app.post('/services/fileExplorer/uploadFile', multiparty(), function( req, res ) {

	var ref = req.query.ref;

	fileService.uploadFile( {
		filePath : req.files.file.path,
		dirPath : req.body.path,
		fileName : req.files.file.originalFilename
	}, function( err, result ) {
		if ( err ) {
			res.send( 400 );
		} else {
			res.send( 200 );
		}
	});
});

app.delete('/services/fileExplorer', function( req, res ) {

	console.log( 'path: ' + req.body.path );

	fileService.delete( { path : req.body.path }, function( err, result ) {
		if ( err ) {
			res.send( 400 );
		} else {
			res.send( 200 );
		}
	});
});

app.post('/file/:table/:id', multiparty(), function(req, res) {

	var table = req.params.table;
	var id = req.params.id;
	var fileName = req.files.image.originalFilename;
	var ref = req.query.ref;

	fs.readFile( req.files.image.path, function( err,  loadData) {

		if (err) throw err;
		var newPath = __dirname + "content/files/" + table + '/' + id;
		mkpath( newPath, function( err ) {
			var file = {
				name : fileName
			}

			dataLoader.postObject( 'files', file, function( err, result ) {
				if (err) {
					res.json( 400, {error: 'SQL error'});
				} else {
					file.id = result.id;
					file.path = table + '/' + id + '/' + result.id;
					async.parallel([
						function( back ) {
							dataLoader.putObject( 'files', file, result.id, function( err, result ) {
								if (err) throw err;
								back();
							});
						},
						function( back ) {
							fs.writeFile( newPath + '/' + result.id, loadData, function( err ){
								if (err) throw err;
								back();
							});
						}
					], function( err, results ) {
						if (err) throw err;
						if ( ref ) {
							res.redirect( 302, ref );
							return;
						}
						res.send( 200, file );
					});
				}
			});

			if (err) throw err;

		});
	});
});


app.listen(nconf.get('port'), function() {
	console.log('Server running at ' + nconf.get('port') + ' port');
});