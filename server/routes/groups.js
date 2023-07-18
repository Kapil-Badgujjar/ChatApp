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
    console.log(req.body.groupname);
});
