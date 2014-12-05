var nconf = require('nconf');
var mysql = require('mysql');
var async = require('async');
var passwordHash = require('password-hash')

var UserDao = function ( configFile ) {

	var SELECT_USER_BY_EMAIL = 'SELECT id, firstName, lastName, email, password, profile FROM users WHERE email = ?';
	var CHECK_USER_EMAIL = 'SELECT email FROM users WHERE email = ?';
	var INSERT_USER = 'INSERT INTO users SET ?';
    var UPDATE_USER_PASSWORD = 'UPDATE users SET password = ? WHERE id = ?';

	nconf.argv()
		.env()
		.file({file: configFile});

	this.pool = mysql.createPool({
		connectionLimit : nconf.get('database:connectionLimit'),
		host : nconf.get('database:uri'),
		port : nconf.get('database:port'),
		database: nconf.get('database:name'),
		user: nconf.get('database:user'),
		password: nconf.get('database:password')
	});

	var validate = function( userParams ) {

		if ( !userParams.email ) {
			return { err: 'emptyField', message: 'field is empty', field: 'email'};
		} else if ( !userParams.password ) {
			return { err: 'emptyField', message: 'field is empty', field: 'password'};
		} else if ( !userParams.repPassword ) {
			return { err: 'emptyField', message: 'field is empty', field: 'repPassword'};
		} else if ( !userParams.profile ) {
			return { err: 'emptyField', message: 'field is empty', field: 'profile'};
		}

		if ( userParams.password != userParams.repPassword ) {
			return { err: 'passNotEqual', message: 'Passwords are not equal', field: ['password', 'repPassword']};
		}

		return { success: true }

	};

    var validatePassword = function( passwordParams ) {

        if ( !passwordParams.password ) {
            return { err: 'emptyField', message: 'field is empty', field: 'password'};
        } else if ( !passwordParams.repPassword ) {
            return { err: 'emptyField', message: 'field is empty', field: 'repPassword'};
        }

        if ( passwordParams.password != passwordParams.repPassword ) {
            return { err: 'passNotEqual', message: 'Passwords are not equal', field: ['password', 'repPassword']};
        }

        return { success: true }

    };

	var createPassword = function( password ) {
		return passwordHash.generate(password);
	};

    this.changePassword = function( passwordParams, done ) {

        var validation = validatePassword( passwordParams );
        var dao = this;
        var password = createPassword( passwordParams.password );
        var id = passwordParams.id;

        if ( validation.success ) {
            dao.pool.query( UPDATE_USER_PASSWORD, [password, id], function( err, row ) {
                if ( err ) {
                    done( err );
                } else {
                    done( null );
                }
            });
        } else {
            done( validation );
        }
    };

	this.authorize = function( email, password, done ) {
		this.pool.query( SELECT_USER_BY_EMAIL, [email], function(err, rows, fields) {
			if ( err ) {
				done( err );
			} else {
				var user = rows[0];
				var userPassword;
				if ( !user ) {
					return done( null, false );
				} else {

					userPassword = user.password;
					delete user.password;

					if ( passwordHash.verify( password, userPassword ) ) {
						return done( null, user );
					}

					return done( null, false );
				}
			}
		});
	};

	this.createUser = function( userParams, done ) {

		var validation = validate( userParams );
		var dao = this;

		if ( validation.success ) {
			async.waterfall([

				function uniquenessCheck( next ) {
					dao.pool.query( CHECK_USER_EMAIL, [userParams.email], function( err, rows ) {
						if (err) {
							next( err );
							return;
						}
						if (rows[0]) {
							next( { err: 'emailExist', message: 'This address is already registered', field: 'email'} );
						} else {
							next( null );
						}
					});
				},

				function createUser( next ) {
					var user = {
						firstName : userParams.firstName,
						lastName : userParams.lastName,
						email : userParams.email,
						profile : userParams.profile,
						password : createPassword( userParams.password )
					};
					dao.pool.query( INSERT_USER, [user], function( err, result ) {
						if (err) {
							next( err );
							return;
						}
						next( null, user );
					});
				}

			], function( err, user ) {
				if ( err ) {
					done( err );
					return;
				}
				done( null, user);
			});
		} else {
			done( validation );
		}
	}
}

module.exports = UserDao;