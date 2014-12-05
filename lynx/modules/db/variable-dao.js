var nconf = require('nconf');
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var variableSchema = new Schema({
	name : String,
	value : String,
	nameSpace : String
}, {
	collection : 'Variables',
	id : true
});

variableSchema.virtual('id').get( function() {
	return this._id.toHexString();
});

variableSchema.set('toJSON', {
    virtuals: true
});


var VariablesDao = function ( configFile, finish ) {

	this.db = mongoose.connection;
	this.Variable = mongoose.model( 'GlobalVariable', variableSchema );


	nconf.argv()
		.env()
		.file({file: configFile});

    var dao = this;


	this.get = function( id, done ) {
		dao.Variable.findById( id, function( err, variable ) {
			done( err, variable );
		});
	}

	this.update = function( variable, done) {
		dao.Variable.findOneAndUpdate( { _id : variable.id } , variable, function( err, variable ) {
			done( err, variable );
		});
	};

	this.create = function( variable, done ) {
        var variableVar = variable;
        dao.Variable.create( variableVar, function( err, variable ) {
        	done( err, variable );
        });
	};

	this.delete = function( id, done ) {
		dao.Variable.findByIdAndRemove( id, function( err ) {
			done( err );
		});
	};

	this.getList = function( done ) {

		var query = dao.Variable.find();
		query.exec( function( err, variables) {
			var list = dao.Variable( variables );
			done( err, variables );
		});
	};

    this.close = function(  ) {
    	// TODO
    };
}

module.exports = VariablesDao;