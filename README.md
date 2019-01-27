# EmailServicesApp

# Description
Email Service api provides an abstraction between 2 Email Service providers
MailGun and SendGrid. If one service goes does down, the application switches to another Email Service api
# Features
## Front End

 - The SendGrid / MailGun api credentials are configurable and are kept in a .env file and are not visible to the Front End.
- EJS has been used to render the html.
- Appropriate Email Validation has been done for the scenarios when the to email id is empty or user enters an invalid email address in to,cc or bcc.
- Validation is in place if user leaves the Subject or Email Content text box blank.
- User gets an alert if the above scenarios are true.
- BootStrap has been chosen to display the Front End Page in a responsive way.
- The Application has been Unit Tested and works in browsers namely Chrome,Firefox and IE
## Back End

 - The back end server side code has been completed using NodeJs,
   ExpressJs, NPM modules.
The back end implements a RESTFul API call and uses the route "/sendmail" using ExpressJS.
 - A recursive Promise function "ServiceCall" handles the core switchover functionality in backend. It is called when the route "/sendmail" is hit.
 - API Services names (SendGrid, MailGun) are stored in an array. The application calls the Email Services in the order they are stored in the array. 
If one service fails, application switches over to the next service in the array and calls the corresponding methods SendMailFromMailGun or SendMailFromSendGrid  to send the mail.
 - Proper Error handling has been done inside the ServiceCall function
   and logs if there is an error in any service.
 - Test cases are written inside the test folder and uses the modules chai and chai-as-promised
 - Comments are added wherever possible.
 
# Steps to start the Application:
1. Create a folder called EmailServiceApp
2. Install the following modules inside EmailServicesApp:
   dotenv,
   express,
   body-parse,
   sendgrid/mail,
   mailgun-js,
   mocha
   chai
   chai-as-promised
3. Create views/pages subfolder under EmailServiceApp and copy the index.ejs file there
4. Copy server.js in the root EmailServiceApp folder
5. Create a test folder under EmailServiceApp folder and then copy test.js into the test folder
6. Copy ,env file under EmailServiesApp folder
7. create .env file with the following keys
MAILGUN_API_KEY=enter the mailgun api key here
MAILGUN_DOMAIN=enter the domain name here
SENDGRID_API_KEY=enter the sendgrid api key here
8.  Execute server side code by typing "node server" at the command line. It should display a message "Listening at port 5000"
9.  Open a web browser and type http://localhost:5000
10. This displays the html page, where user can enter To, CC,BCC,Subject and Content and click Send button to send the mail
11. Appropriate alert is given to the user if wrong input is given at the front end
12. The package.json should contains the following entry for the Test cases 
       "scripts": {
    "test": "mocha"
  } 
  Test Cases can be executed from the root folder by typing npm run test
  
### Known Issue: 
Mailfun api seems to have issues . Even after adding email ids added to the authorised email list in mailgun, the mail is not sent


