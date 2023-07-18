import express from 'express'
import crypto from 'crypto'
import sendgrid from '../utils/sendgrid.js'
import userservices from '../services/users_services.js'
const regex_email = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
const regex_password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
const router = express.Router();

router.route('/login').post(async (req,res)=>{
    if(req.body.email_id == undefined || req.body.email_id === '' || req.body.password == undefined || req.body.password === '') {
        res.status(401).send('Enter proper values');
        return;
    }
    const result = await userservices.checkUser(req.body);
    if(result.flag == 0){
        res.status(404).send('No user found');
    }else{
        req.session.user_name = result.user.user_name;
        req.session.user_id = result.user.user_id;
        res.status(200).send(result.user);
    }
});

router.route('/logout').get((req,res)=>{
    req.session.destroy();
    res.status(200).send('Logout successful');
});

router.route('/signup').post(async (req,res)=>{
    if(req.body.name === undefined || req.body.name === '') {
        res.status(401).send('Name is required');
        return;
    }
    if(req.body.email_id === undefined || req.body.email_id === '') {
        res.status(401).send('Email is required');
        return;
    }
    if(!regex_email.test(req.body.email_id)){
        res.status(401).send('Please Enter an email id');
        return;
    }
    if(req.body.phone === undefined || req.body.phone === '') {
        res.status(401).send('Phone number is required');
        return;
    }
    if(req.body.dob === undefined || req.body.dob === '') {
        res.status(401).send('Date of birth is required is required');
        return;
    }
    if(req.body.password === undefined || req.body.password === '') {
        res.status(401).send('Password is required');
        return;
    }
    if(req.body.confirmPassword === undefined || req.body.confirmPassword === '') {
        res.status(401).send('Confirm password is required');
        return;
    }
    if(req.body.password !== req.body.confirmPassword){
        res.status(401).send('Confirm Password not match!');
        return;
    }
    if(!regex_password.test(req.body.password)){
        res.status(401).send('Password must contain at least one uppercase character, one lowercase character, one digit, one special character.');
        return;
    }
    const verification_token = crypto.randomBytes(10).toString('hex');
    const result = await userservices.addUser(req.body,verification_token);
    if(result){
        //Sending user verification email through sendgrid
        console.log(req.body.email_id, "----");
        sendgrid.verificationEmail(req.body.email_id,verification_token);

        //send back response
        res.status(200).send('signup successful');
    } else
        res.status(400).send('Email ID already linked to an account!');
    return;
});
//user account verification function
router.route('/verify-account/:token').get(async (req, res) => {
    const token = req.params.token;    //token received from params in url
    userservices.verifyUser(token); //verify service called
    res.redirect('http://localhost:5173/login');
})
router.route('/update-password').post(async (req,res) => {
    console.log(req.body);
    if(req.body.email_id === undefined || req.body.email_id === ''){
        res.status(401).send('Please Enter email id');
        return;
    }
    if(!regex_email.test(req.body.email_id)){
        res.status(401).send('Please Enter an email id');
        return;
    }
    const result = await userservices.findUser(req.body);
    if(result.flag == 0){
        res.status(404).send('No user found');
        return;
    }else{
        try{
            const password_update_token = crypto.randomBytes(10).toString('hex');
            await userservices.setPasswordUpdateRequest(req.body, password_update_token);
            sendgrid.passwordUpdateEmail(req.body.email_id, password_update_token);
            res.status(200).send('Password update request sent to your email');
        }
        catch(error){
            console.log(error.message);
            res.status(500).send('Error updating password');
        }
    }

});

router.route('/reset-password/:token').post(async(req,res)=>{

    const token = req.params.token;
    if(req.body.newPassword === undefined || req.body.newPassword === ''){
        res.status(401).send('Please Enter password');
        return;
    }
    if(req.body.confirmPassword === undefined || req.body.confirmPassword === ''){
        res.status(401).send('Please Enter confirm password');
        return;
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        res.status(401).send('Confirm Password not match!');
        return;
    }
    if(!regex_password.test(req.body.newPassword)){
        res.status(401).send('Password must contain at least one uppercase character, one lowercase character, one digit, one special character.');
        return;
    }
    await userservices.updatePassword(req.body.newPassword, token);
    res.status(200).send('Password updated');

});

export default router;