var nconf = require('nconf');
var mysql = require('mysql');
var async = require('async');
var passwordHash = require('password-hash')

var GlobalVariablesDao = function ( configFile ) {

	var SELECT_VARIABLE_LIST = 'SELECT * FROM globalVariables';
	var SELECT_VARIABLE_BY_ID = 'SELECT * FROM globalVariables WHERE id = ?';
	var INSERT_VARIABLE = 'INSERT INTO globalVariables SET ?';
	var UPDATE_VARIABLE = 'UPDATE globalVariables SET ? WHERE id = ?';
	var DELETE_VARIABLE = 'DELETE FROM globalVariables WHERE id = ?';

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

	this.get = function( id, done ) {
		this.pool.query( SELECT_VARIABLE_BY_ID, [id], function( err, variables ) {
			done( err, variables[0] );
		});
	}

	this.update = function( variable, done) {
		this.pool.query( UPDATE_VARIABLE, [variable, variable.id], function( err, variable ) {
			done( err, variable );
		});
	};

	this.create = function( variable, done ) {
        var variableVar = variable;
		this.pool.query( INSERT_VARIABLE, [variable], function( err, result ) {
            variableVar['id'] = result.insertId;
			done( err, variableVar);
		});
	};

	this.delete = function( id, done ) {
		this.pool.query( DELETE_VARIABLE, [id], function( err ) {
			done( err );
		});
	};

	this.getList = function( done ) {
		this.pool.query( SELECT_VARIABLE_LIST, [], function( err, variables ) {
			done( err, variables );
		});
	};
}

module.exports = GlobalVariablesDao;