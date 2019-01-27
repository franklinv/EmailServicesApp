var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();


var emailapi = require('../server.js');

// Tests are hierarchical. Here we define a test suite for our calculator.
describe('Email Service Provider Tests', function() {
	// testcase for 
	it('returns mailgun success if pass else mailgun error', function(done) {
     var data = {
    //Specify email data
      
    //The email to contact
      to: 'franklin.vincent@gmail.com',
	  cc: [],
	  bcc: [],
	  from: 'me@samples.mailgun.org',
    //Subject and text data  
      subject: 'Hello from Mailgun',
      text: 'Hello this is the mail text from mail gun'
    }
		
		emailapi.SendMailFromMailGun(data).should.eventually.equal("Mail sent successfully using mailgun");
		done();
	});

	it('returns sendgrid success if pass else sendgrid error', function(done) {
        var data = {
				  to: 'franklin.vincent007@gmail.com',
				  cc: 'franklin.vincent@gmail.com',
				  bcc: [],
				  from: 'sender@example.org',
				  subject: 'hello mail subject from sendgrid',
				  text: 'hello mail text'
				  //html: '<p>Hello HTML world!</p>',
				};
		 emailapi.SendMailFromSendGrid(data).should.eventually.equal("Mail sent successfully using SendGrid");
		// Invoke done when the test is complete.
		done();
	});
});