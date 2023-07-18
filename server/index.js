//importing packages and other files that are needed
import { Server } from 'socket.io';
import express from 'express';
import session from 'express-session'
import http from 'http';
import cors from 'cors';

//importing local files/modules
import User from './routes/user.js'
import Friends from './routes/friends.js'
import Chats from './routes/chats.js'
import Groups from './routes/groups.js'

//creating app with express
const app = express();

//creating http server
const httpServer = http.createServer(app);

//creating instance of socket.io Server
const io = new Server(httpServer,{
    cors :{
        origin: 'http://localhost:5173',
        credentials: true
    }
});

//declaring a global map for storing online users
global.onlineUsers = new Map();

//starting the server on port 4800
httpServer.listen(4800, () => {
    console.log('Started at port 4800');
});

//setting up socket
io.on('connection', (socket) => {
    global.chatSocket = socket;
    socket.on('add-user',(user_id) => {
        onlineUsers.set(user_id, socket.id);
        console.log('Added user' , user_id, onlineUsers.get(user_id));
    });
    socket.on('send-message', (data) => {
        console.log("message received",data); //to check if message is received or not
        const sendUserSocketId = onlineUsers.get(data.to);
        if(sendUserSocketId){
            socket.to(sendUserSocketId).emit('message-received',{sender_id: data.from, message_text: data.message});
            console.log('message-received event emitted', data.message)
        }
    });
});

//using express.json middleware
app.use(express.json());


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

//using express session for session management
app.use(session(
    {
        secret: 'secret',
        resave: false,
        saveUninitialized: true
    }
));

//using routers
app.use('/user',User);
app.use('/friends',Friends);
app.use('/chats',Chats);
app.use('/groups',Groups);

//end-point to check if the session exists or not
app.get('/check-session', (req, res) => {
    if(req.session.user_id != undefined) {
        res.status(200).send({id: req.session.user_id, name: req.session.user_name});
    } else {
        res.status(401).send('Login to your account!');
    }
});


app.post('/api/messages', (req, res) => {
    const { user, message } = req.body;

    // Emit the new message to all connected clients
    // io.emit('message', { user, message });

    res.sendStatus(200);
});
