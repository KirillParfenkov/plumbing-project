var nconf = require('nconf');
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var contentSchema = new Schema({
	name : String,
	title : String,
	body : String
}, {
	collection : 'Contents',
	id : true
});

contentSchema.virtual('id').get( function() {
	return this._id.toHexString();
});

contentSchema.set('toJSON', {
    virtuals: true
});


var ContentDao = function ( configFile, finish ) {

	this.db = mongoose.connection;
	this.Content = mongoose.model( 'Content', contentSchema );


	nconf.argv()
		.env()
		.file({file: configFile});

    var dao = this;


	this.get = function( id, done ) {
		dao.Content.findById( id, function( err, variable ) {
			done( err, variable );
		});
	}

	this.update = function( variable, done) {
		dao.Content.findOneAndUpdate( { _id : variable.id } , variable, function( err, variable ) {
			done( err, variable );
		});
	};

	this.create = function( variable, done ) {
        var variableVar = variable;
        dao.Content.create( variableVar, function( err, variable ) {
        	done( err, variable );
        });
	};

	this.delete = function( id, done ) {
		dao.Content.findByIdAndRemove( id, function( err ) {
			done( err );
		});
	};

	this.getList = function( done ) {

		var query = dao.Content.find();
		query.exec( function( err, variables) {
			var list = dao.Content( variables );
			done( err, variables );
		});
	};

    this.close = function(  ) {
    	// TODO
    };
}

module.exports = ContentDao;