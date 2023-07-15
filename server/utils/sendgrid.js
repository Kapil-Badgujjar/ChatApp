//sendgrid email service

import dotenv from 'dotenv'
import sgMail from '@sendgrid/mail'

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_SK);

function verificationEmail(to,token){
    const message = {
        to : to,
        from : 'k.b.cool.boy99@gmail.com',
        subject : 'Account verfication',
        text : 'Your device does not support links,please open this mail in smart device and verify your account.',
        html : `<h2>Please verify your account</h2><a href='http://localhost:4800/user/verify/${token}'>Click here...</a>`
    }
    sgMail.send(message).then((response) => {
        console.log('Verification email sent successfully');
    }).catch((error) => { console.log(error.message) });
}

function passwordUpdateEmail(to,token){
    const message = {
        to : to,
        from : 'k.b.cool.boy99@gmail.com',
        subject : 'Password update request',
        text : 'Your device does not support links,please open this mail in smart device and update your password.',
        html : `<h2>Click on below link to update your password</h2><a href='http://localhost:4800/user/password-update/${token}'>Click here...</a>`
    }
    sgMail.send(message).then((response) => {
        console.log('Password update email sent successfully');
    }).catch((error) => { console.log(error.message) });
}

export default {verificationEmail,passwordUpdateEmail};