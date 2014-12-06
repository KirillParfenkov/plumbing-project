var nconf = require('nconf');
var nodemailer = require('nodemailer');

var EmailService = function( configFile ) {

	nconf.argv()
		.env()
		.file({file: configFile});

	this.transporter = nodemailer.createTransport({
		service : nconf.get('email:service'),
		auth : {
			user : nconf.get('email:sender'),
			pass : nconf.get('email:password')
		}
	});

	this.sendMail = function( emailOption, callback ) {
		this.transporter.sendMail( emailOption, function( err, info ) {
			if ( callback ) {
				callback( err, info );
			} else if ( err ){
				console.log( err );
			}
		});
	}
}

module.exports = EmailService;