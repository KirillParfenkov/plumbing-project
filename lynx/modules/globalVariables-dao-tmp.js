var nconf = require('nconf');
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var globalVariableSchema = new Schema({
	name : String,
	value : String,
	nameSpace : String
}, {
	collection : 'GlobalVariables',
	id : true
});

globalVariableSchema.virtual('id').get( function() {
	return this._id.toHexString();
});

globalVariableSchema.set('toJSON', {
    virtuals: true
});


var GlobalVariablesDao = function ( configFile, finish ) {

	this.db = mongoose.connection;
	this.GlobalVariable = mongoose.model( 'GlobalVariable', globalVariableSchema );


	nconf.argv()
		.env()
		.file({file: configFile});

    var dao = this;


	this.get = function( id, done ) {
		dao.GlobalVariable.findById( id, function( err, variable ) {
			done( err, variable );
		});
	}

	this.update = function( variable, done) {
		dao.GlobalVariable.findOneAndUpdate( { _id : variable.id } , variable, function( err, variable ) {
			done( err, variable );
		});
	};

	this.create = function( variable, done ) {
        var variableVar = variable;
        dao.GlobalVariable.create( variableVar, function( err, variable ) {
        	done( err, variable );
        });
	};

	this.delete = function( id, done ) {
		dao.GlobalVariable.findByIdAndRemove( id, function( err ) {
			done( err );
		});
	};

	this.getList = function( done ) {

		var query = dao.GlobalVariable.find();
		query.exec( function( err, variables) {
			var list = dao.GlobalVariable( variables );
			done( err, variables );
		});
	};

    this.close = function(  ) {
    	// TODO
    };
}

module.exports = GlobalVariablesDao;