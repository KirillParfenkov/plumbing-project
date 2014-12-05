var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service : "Gmail",
	auth : {
		user : 'Kiryl.Parfiankou.Dev@gmail.com',
		pass : 'azk@ovn@gdj'
	}
});

var mailOptions = {
	to : 'Kirill.Parfenkov@gmail.com',
	subject: 'Test',
	text : 'Test World!',
	html : '<b> Hello!</b>'
}

transporter.sendMail( mailOptions, function( err, info ) {
	if (err) {
		console.log( err );
	} else {
		console.log( 'Info: ' + info.response);
	}
});