import express from 'express'
import sendgrid from '../utils/sendgrid.js'
import userservices from '../services/users_services.js'

const router = express.Router();

router.route('/login').post(async (req,res)=>{
    if(req.body.email_id == undefined || req.body.password == undefined) {
        res.status(401).send('Enter proper values');
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
    const result = await userservices.addUser(req.body);
    if(result)
        res.status(200).send('signup successful');
    else
        res.status(400).send('Email ID already linked to an account!');

});

router.route('/update-password').post((req,res) => {

});

export default router;