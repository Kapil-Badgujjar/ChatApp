import express from 'express'
import groups_service from '../services/groups_services.js';
const router = express.Router();

router.route('/groups-list').get(async (req,res) => {
    const groupsList = await groups_service.getGroups(req.session.user_id);
    if(groupsList.length == 0){
        res.status(401).send({ message: 'No Groups found!'});
    } else {
        res.status(200).send(groupsList);
    }
});

router.route('/add-group').post(async (req,res) => {
    console.log(req.session.user_id,req.body.groupname);
    try{
        const result = await groups_service.addGroup(req.session.user_id,req.body.groupname);
        res.status(200).send(result);
    } catch(error){
        console.log(error.message);
        res.status(500).send('Server error');
    }
});

router.route('/add-friend-to-group').post(async (req,res) => {
    await groups_service.addFriendsToGroup(req.body.chat_id, req.body.participent_id);
    res.status(200).send('added');
});

router.route('/search-friends').post(async (req, res) => {
    const result = await groups_service.searchFriends(req.body.chat_id, req.body.text);
    res.status(200).send(result);
});
export default router;