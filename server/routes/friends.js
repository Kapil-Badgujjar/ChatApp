import express from 'express'
import friends_service from '../services/friends_services.js';
const router = express.Router();


router.route('/friends-list').get(async (req,res) => {
    const friendsList = await friends_service.getFriends(req.session.user_id);
    if(friendsList.length == 0){
        res.status(401).send({ message: 'No friends found!'});
    } else {
        res.status(200).send(friendsList);
    }
});


router.route('/search-friends').post(async (req, res) => {
    const list = await friends_service.searchFriends(req.session.user_id, req.body.text);
    if(list.length > 0) {
        res.status(200).send(list);
    }
    else {
        res.status(200).send([]);
    }
});

router.route('/add-friend').post(async (req,res) => {
    const result = await friends_service.addFriend(req.session.user_id, req.body.id);
    if(result) res.status(200).send(result);
    else res.status(500);
});

router.route('remove-friend').post(async (req,res) => {
    const result = await friends_service.removeFriend(req.session.user_id, req.body.id);
    if(result) res.status(200).send(result);
    else res.status(500);
});
export default router;