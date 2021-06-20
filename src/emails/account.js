const sgMail = require('@sendgrid/mail')

//const sendGridAPIKEY = 'SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxAlynsdFZwrgpLEYDIkdg' // it is not secure to keep API KEY here for this reason we have created an env variable and moved the key in config/.env file
//sgMail.setApiKey(sendGridAPIKEY)

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({

//     to: 'cetinogut.gm@gmail.com',
//     from: 'cetinogut.gm@gmail.com',
//     subject: 'This is mt first NodeJS email in SendGrid',
//     text: 'this is a test mail'
// })

const sendWelcomeEmail = ( email, name) => {

    sgMail.send({
        to: email,
        from: 'cetinogut.gm@gmail.com',
        subject: 'thanks for joining in',
        text: `welcome to the app, ${name}, Let me know how you get along with the app...`,
        html: ' <h1>welcome to Dastugo Tech</h1>'
        //templateId: 'd-376e4eb49f9e4c579e7a456466e6cc71 '  // if we want to send custom emails from sendgrid dashboard
    })
}

const sendCancelationEmail = ( email, name) => {

    sgMail.send({
        to: email,
        from: 'cetinogut.gm@gmail.com',
        subject: 'thanks for working with us',
        text: `Dear ${name}, We are sorry that you are leaving the paltform. Let me know how you get along with the app...`,
        html: ' <h1>GoodBye from Dastugo Tech</h1>'
        //templateId: 'd-376e4eb49f9e4c579e7a456466e6cc71 '  // if we want to send custom emails from sendgrid dashboard
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}