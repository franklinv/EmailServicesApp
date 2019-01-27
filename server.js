// server.js
// loading the modules we need
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
var strResult="";
// use res.render to load up an ejs view file
// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});


EmailServiceFailOverArr=["mailgun","sendgrid"];
var ServiceIndex=0;
var RetryCount=1;
var MaxTries=2;
var strMsg={};

// route for sending email 
app.post('/sendmail', function(req, res) {
	   
		  
	  var strError="";
	  
	  
	  strMsg["from"]='franklin.vincent@gmail.com'

	  strMsg["to"]=req.body.mailto;
		 // if cc or bcc is empty neither service should throw error
		 if (req.body.cc=="empty")
		 {
		  strMsg["cc"]=[];
		 }
		 else{
			 strMsg["cc"]=req.body.cc;
		 }
		 
		 if (req.body.bcc=="empty")
		 {
		  strMsg["bcc"]=[];
		 }
		 else{
			 strMsg["bcc"]=req.body.bcc;
		 }
		
		strMsg["subject"]=req.body.subject;
		strMsg["text"]=req.body.emailtext;
		var PromisMain=ServiceCall(0,strMsg);
		PromisMain.then(function(value) {
			//console.log(value);
			
			res.end(JSON.stringify(value));
			
           
			}).catch(function(error) {
				ServiceIndex++;
				if (ServiceIndex > (EmailServiceFailOverArr.length-1) ){
                    ServiceIndex =0;
				}
				RetryCount++;
				return ServiceCall(ServiceIndex,strMsg).then(function(value) {
					res.end(JSON.stringify(value));  
				});
			});
        
	    
});






	
function ServiceCall(ServiceIndex,strMsg)
	   {

		return new Promise(function(resolve, reject) {
		var emailserver=EmailServiceFailOverArr[ServiceIndex];
		
		if (RetryCount > MaxTries)
		{
			console.log("All Send Mail Service are unavailable");
			process.exit();
		}
               // if user has selected mailgun server
	   if (emailserver=="mailgun")
	   {
	        
            var mailgunpromise=SendMailFromMailGun(strMsg);
		  
		    mailgunpromise.then(function(value) {
			//console.log(value);
			resolve(value);

			}).catch(function(error) {
				reject("Error sending mail thru mailgun");
			});
	
	   }
	 else if (emailserver=="sendgrid"){
		
		  // if user has selected sendgrid server	
		   var sendgridpromise=SendMailFromSendGrid(strMsg);
		   sendgridpromise.then(function(value) {
	       
			resolve(value);
			}).catch(function(error) { 
			   reject("Error sending mail thru SendGrid");
			});
		 
	   }

	});
}
app.listen(5000);
console.log("Listening at port 5000");


// function which will send mail using mailgun
// returns promise object
var SendMailFromMailGun=function(strMsg)
{  
      return new Promise(function(resolve, reject) {
		   	  mailgun.messages().send(strMsg).then(function (body) {
			  console.log("Mail sent successfully using mailgun");
			  resolve("Mail sent successfully using mailgun");
			}).catch(function(error) {
			  	
			  console.log(error);
			  reject("error sending mail through mailgun");
			  
			});

		 	 
		});
}
	 
	 


// function which will send mail using sendgrid
// returns promise object
var SendMailFromSendGrid=function(strMsg)
{
	return new Promise(function(resolve, reject) {
	sgMail
  .send(strMsg)
  .then(() => {
    console.log("Mail sent successfully using SendGrid");
	resolve("Mail sent successfully using SendGrid");
  })
  .catch(error => {

	//Log friendly error
	
    console.log("Error sending mail through Send Grid.trying to send from mailgun");
    reject("Error sending mail through Send Grid.trying to send from mailgun");
  });

});
	
}

module.exports= {
	SendMailFromSendGrid : SendMailFromSendGrid,
	SendMailFromMailGun: SendMailFromMailGun
}

