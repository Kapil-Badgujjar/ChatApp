import express from 'express';
import chats_services from '../services/chats_services.js';

const router = express.Router();

router.route('/get-chat').post(async (req,res)=>{

    const result = await chats_services.getChats(req.body.chat_id); //change the hardcoded value
    if(result.length>0){
        res.status(200).send(result);
    } else {
        res.status(401).send('No chats found!');
    }
})

router.route('/send').post(async (req,res) => {
    const result = await chats_services.saveMessage(req.body.chat_id,req.body.message,req.session.user_id);
    if(result == true){
        res.status(200).send(`Message sent`);
    }else {
        res.status(500).send('Message not sent')
    }
})
export default router;