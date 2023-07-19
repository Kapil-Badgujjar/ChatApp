import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import './Chats.css'
import Button from '../components/Button/Button'
import { useNavigate } from 'react-router-dom'
import Context from '../utils/context'
import DropDown from '../components/DropDown/DropDown'

export default function Chats() {
  const socket = useRef();
  const navigate = useNavigate();
  const [searchActive, setSearchActive] = useState(false);
  const [isGroups, setIsGroups] = useState(false);
  const [friends, setFrineds] = useState([]);
  const [createGroupForm, setCreateGroupForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [chats, setChats] = useState([]);
  const [chatWith, setChatWith] = useState(undefined);
  const [messageText, setMessageText] = useState('');
  const {userName,setUserName,userID,setUserID} = useContext(Context);
  const [searchText, setSearchText] = useState('');
  const [searchFriendsList, setSearchFriendsList] = useState([]);
  socket.current = io('http://localhost:4800');


  useEffect(()=>{
    if(userID){
      socket.current.emit('add-user', userID);
      socket.current.on('message-received', (msg)=>{
        // console.log('Hy messese is received');
        // console.log(chats);
        setChats([...chats,{sender_id: msg.sender_id, message_text: msg.message_text}]);
      })
    }
    return ()=>{
      if(userID){
        socket.current.emit('remove-user', userID);
      }
    }
  })

  async function getFriendsList(){
    try{
      const response = await axios.get('http://localhost:4800/friends/friends-list',{withCredentials: true});
      if(response.status === 200 ){
        setFrineds(response.data);
      } else {
        setFrineds([]);
      }
    } catch (error) {
      try{
        let errormessage = JSON.parse(error.response.request.response);
        console.log(errormessage.message)
      } catch (error) {
        console.log(error.message);
      }
      setFrineds([]);
    }
  }

  async function getGroupsList(){
    try{
      const response = await axios.get('http://localhost:4800/groups/groups-list',{withCredentials: true});
      if(response.status === 200){
        console.log(response.data);
        setFrineds(response.data);
      }else{
        setFrineds([]);
      }
    } catch (error) {
      try{
        let errormessage = JSON.parse(error.response.request.response);
        console.log(errormessage.message)
      } catch (error) {
        console.log(error.message);
      }
      setFrineds([]);
    }
  }

  async function addGroup(){
    if(groupName.trim() === '') return;
    try{
      const response = await axios.post('http://localhost:4800/groups/add-group',{groupname: groupName},{withCredentials: true});
      if(response.status == 200){
        setCreateGroupForm(false);
      }
    }
    catch (error) {
      console.log(error.message);
    }
  }
  async function openChat(friend){
    setChatWith(friend);
    try{
      const response = await axios.post('http://localhost:4800/chats/get-chat',{chat_id:friend.chat_id},{withCredentials:true});
      setChats(response.data);
    } catch(error) {
      setChats([]);
      console.log(error.response);
    }
  }

  //TODO:
  useEffect(()=>{
    console.log(chats);
  } ,[chats]);

  async function sendMessage(){
    console.log(userID);
    console.log(messageText);
    if(messageText == '') return;
    try{
      const response = await axios.post('http://localhost:4800/chats/send',{chat_id: chatWith.chat_id, message: messageText}, {withCredentials: true});
      if(response.status === 200){
        setChats([...chats,{sender_id: userID, message_text: messageText}]);
        setMessageText('');
        console.log(socket.current,chatWith);
        socket.current.emit('send-message',{ to: chatWith.participent_id, from : userID, message: messageText});
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  
  async function searchFriends(text){
    if(text.trim()==''){ setSearchFriendsList([]); return; }
    try {
      const response = await axios.post('http://localhost:4800/friends/search-friends',{text: text},{withCredentials: true});
      if(response.status == 200){
        setSearchFriendsList(response.data);
      }
    } catch(error){
      setSearchFriendsList([]);
      console.log(error.message);
    }
  }
  useEffect(()=>{
    axios.get('http://localhost:4800/check-session',{withCredentials: true})
    .then((response)=>{ 
      setUserName(response.data.name);
      setUserID(response.data.id);
      isGroups ? getGroupsList() :getFriendsList();
    }).catch((error)=>{
       console.error(error.message); 
       navigate('/login');
      });
  },[isGroups]);

  return (
    <div className="chats-container">
      <div className="chats-container-left">
        { !isGroups && searchActive && <div className="chats-container-left-header">
          <input type="text" placeholder="Search" value={searchText} onChange={(e)=>{setSearchText(e.target.value); searchFriends(e.target.value)}}/>
          {/* <Button value="=>" action={()=>{}} /> */}
          { searchFriendsList.length >0 && <DropDown data={searchFriendsList} /> }
        </div>}
        <div className="chats-container-left-options">
          {!isGroups && <span className={isGroups ? '': 'fillclass'} onClick={()=>{setIsGroups(true)}}>Chats</span> }
          {!isGroups && <span className={searchActive ? 'fillclass':''} onClick={()=>{setSearchActive(!searchActive)}}>Find Friend</span> }
          {isGroups && <span className={isGroups ? 'fillclass': ''} onClick={()=>{setIsGroups(false)}}>Groups</span> }
          {isGroups && <span onClick={()=>{setCreateGroupForm(!createGroupForm)}}>Create New Group</span> }
        </div>
            {!isGroups && friends.map((friend)=>{
              return (
              <div key={friend.chat_id+'L'} className="friend-row" onClick={()=>{openChat(friend)}}>
                <div className="friendName">
                  {friend.user_name}
                </div>
                <div className="email_id">
                  {friend.email_id}
                </div>
                {/* <div className='last-message'>
                  Text
                </div>
                <span className='time'>08:43 AM</span> */}
              </div>
              )
            })}
            {isGroups && !createGroupForm && friends.map((friend)=>{
              return (
              <div key={friend.chat_id+'L'} className="friend-row group-row" onClick={()=>{openChat(friend)}}>
                <div>
                  <div className="friendName">
                    {friend.group_name}
                  </div>
                  {/* <div className="email_id">
                    {friend.email_id}
                  </div> */}
                  {/* <div className='last-message'>
                    Text
                  </div>
                  <span className='time'>08:43 AM</span> */}
                </div>
                  <div className='group-settings' onClick={()=>{navigate(`/group-settings/${friend.chat_id}`)}}>Add Friends</div>
              </div>
              )
            })}
            {isGroups && createGroupForm && <div className='NewgroupForm'>
              <input type='text' value={groupName} placeholder='Enter Group name' onChange={(e)=>{setGroupName(e.target.value)}} />
              <Button value='Next' action={addGroup}/>
              </div>
            }
      </div>
      <div className="chats-container-right">
        { chatWith && <div className="chats-container-right-header">{chatWith.user_name ? chatWith.user_name : chatWith.group_name}</div> }
        <div className="chat-box">
          {chats.map((message)=>{
            return message.sender_id != userID ? <div className="received-message">{message.message_text}</div>:<div className="sent-message">{message.message_text}</div>;
          })}
        </div>
        {chatWith && <div className="chats-container-right-message-writer">
              <input type="text" className="message-input-box" placeholder='Write a message...' value={messageText} onChange={(e)=>{setMessageText(e.target.value)}}/>
              <div>
                {/* <span>file</span>
                <span> emoji </span> */}
                <Button value="Send" action={() =>{sendMessage()}} />
              </div>
        </div> }
      </div> 
    </div>
  )
}
