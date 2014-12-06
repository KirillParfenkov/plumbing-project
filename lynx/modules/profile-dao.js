var nconf = require('nconf'),
	mysql = require('mysql'),
	async = require('async'),
	DataLoader = require('./data-loader'),
	passwordHash = require('password-hash'),
	fs = require('fs');

var ProfileDao = function ( configFile, permissionSetsDir, casher ) {

	this.dataLoader = new DataLoader(configFile);

	this.permissionSetsPath = __dirname + '/../' + permissionSetsDir;

	var PROFILE_TABLE = 'profiles';


	this.getProfileList = function( done ) {
		this.dataLoader.getObjects( PROFILE_TABLE, function( err, profiles ) {
			done( err, profiles );
		});
	};

	this.initialize = function ( done ) {
		this.dataLoader.initialize(function( err ) {
			done( err );
		});
	};

	this.getProfileById = function( id, done ) {
		var permissionSetsPath = this.permissionSetsPath;
		this.dataLoader.getObject( 'profiles', id, function( err, row, fields) {
			if ( err ) {
				done( err );
			} else {
				var profile = row;
				if ( !profile ) {
					return done( null, false );
				} else {
					fs.readFile( permissionSetsPath + '/' + profile.name + '.json', 'utf-8', function(err, data) {
						if (err) {
							return done( null, profile );
						} else {
							profile.permissionSet = JSON.parse( data );
							return done( null, profile );
						}
					});
				}
			}
		});
	};

	this.saveProfile = function( profile, doneSave ) {

		var dao = this;

		var permissionSetsPath = this.permissionSetsPath;
		var insertRequest = "INSERT INTO profiles SET ?",
			updateReqyest = "UPDATE profiles SET ? WHERE id = ?";

		var permissionSet = profile.permissionSet;
		delete profile.permissionSet;

		async.waterfall([
			function saveProfile( done ) {
				console.log('saveProfile!');

				if ( profile.id ) {
					dao.dataLoader.putObject( PROFILE_TABLE, profile, profile.id, function( err, result ) {
						console.log( err );
						done( err, result );
					});
				} else {
					dao.dataLoader.postObject( PROFILE_TABLE, profile, function( err, result ) {
						done( err, result );
					});
				}
			},
			function savePermissionSet( profile, done ) {
				console.log('savePermissionSet!');
				profile.permissionSet = permissionSet;
				if ( permissionSet ) {
					fs.writeFile( permissionSetsPath + '/' + profile.name + '.json', JSON.stringify(permissionSet), function( err ){
						done( err, profile );
					});
				} else {
					done( null, profile );
				}
			}
		], function ( err, profile ) {
			console.log('result!');
			doneSave( err, profile );
		});
	}

	this.getProfileScheme = function( done ) {

		var permissionSetsPath = this.permissionSetsPath;
		fs.readFile( permissionSetsPath + '/scheme.json', 'utf-8', function( err, data ) {
			if (err) {
				return done( err );
			} else {
				return done( null, JSON.parse( data ) );
			}
		});
	}

	this.getPermissionSet = function( name, done ) {
		var permissionSetsPath = this.permissionSetsPath;
		fs.readFile( permissionSetsPath + '/' + name + '.json', 'utf-8', function(err, data) {
			if (err) {
				return done( err );
			} else {
				var permissionSet = JSON.parse( data );
				return done( null, permissionSet );
			}
		});
		
	};
}

module.exports = ProfileDao;