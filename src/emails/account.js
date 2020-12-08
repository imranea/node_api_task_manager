require('dotenv').config()

const sgMail = require("@sendgrid/mail")

const sendgridAPIKey = process.env.TOKEN_EMAIL

sgMail.setApiKey(sendgridAPIKey)


const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to:email,
        from:'imrane.abdoul@gmail.com',
        subject:'Thanks for joining',
        text: `Welcome to the app, ${name}. let me know how you get along with the app.`
    })
}

const sendDeleteEmail = (email,name) =>{
    sgMail.send({
        to:email,
        from:'imrane.abdoul@gmail.com',
        subject:'Delete account',
        text:`Hello ${name}, you have deleted your account`
    })
}


module.exports={
    sendWelcomeEmail,
    sendDeleteEmail
}