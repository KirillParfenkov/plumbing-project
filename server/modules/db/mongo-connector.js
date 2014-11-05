var mongoose = require('mongoose');
var host = '188.226.143.131';

module.exports = {
	connect : function ( connected, closed, disconected ) {
		mongoose.connect( host, 'lynx', 27017, {
			user : 'lynx',
			pass : 'erbnruqp'
		});

		mongoose.connection.on( 'connected', function() {
			console.log( 'Mongoose default connection open to ' + host );
		});

		mongoose.connection.on( 'error', function( err ) {
			console.log( 'Mongoose default connection error: ' + err );
		});

		mongoose.connection.on( 'disconnected', function() {
			console.log('Mongoose default connection disconnected');
		});

		process.on('SIGINT', function() {
			mongoose.connection.close( function () {
				console.log('Mongoose default connection disconnected through app termination');
				process.exit(0);
			});
		});

	}
};