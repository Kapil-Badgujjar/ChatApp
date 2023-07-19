import React, { useEffect, useState, useContext } from 'react'
import Button from '../components/Button/Button'
import FriendRow from '../components/DropDown/FriendRow';
import './Style.css'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Context from '../utils/context';
export default function GroupSettinsPage() {
    const {id} = useParams('id');
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [searchFriends, setSearchFriends] = useState([]);
    const {setUserName,setUserID} = useContext(Context);
    async function searchFriendsFun(){
        if(text.trim()==''){ setSearchFriends([]); return; }
        try {
          const response = await axios.post('http://localhost:4800/groups/search-friends',{chat_id: id, text: text},{withCredentials: true});
          if(response.status == 200){
            setSearchFriends(response.data);
          }
        } catch(error){
          setSearchFriends([]);
          console.log(error.message);
        }
      }

      async function addFriend(p_id){
        try {
            const response = await axios.post('http://localhost:4800/groups/add-friend-to-group',{chat_id: id, participent_id: p_id},{withCredentials: true});
            if(response.status == 200){
              console.log(response.data);
              searchFriendsFun();
            }
          } catch(error){
            console.log(error.message);
          }
      }

    useEffect(()=>{
        searchFriendsFun();
    },[text])

    useEffect(()=>{
        axios.get('http://localhost:4800/check-session',{withCredentials: true})
        .then((response)=>{ 
        setUserName(response.data.name);
        setUserID(response.data.id);
        }).catch((error)=>{
        console.error(error.message); 
        navigate('/login');
        });
    },[]);
  return (
    <div className='group-setting-page'>
        <p className='backlink' onClick={()=>{navigate('/chats')}}>Back to chats</p>
        {/* <div className="group-details">
            <label>Group name : </label> */}
            {/* <input type="text" placeholder='Group name' /> */}

        {/* </div> */}
        <h1>Add Friends</h1>
        <div className="group-friend-search">
            <input type='text' placeholder='Search for a friend' value={text}  onChange={(e)=>{ setText(e.target.value)}}/>
            {/* <Button value='search' /> */}
        </div>
        <div className="searchFriendRow">
            {searchFriends.map((friend)=>{
                return (
                    <div key={friend.user_id+'li'}>
                        <div >
                            <h2>{friend.user_name}</h2>
                            <div>{friend.email_id}</div>
                        </div>
                        <Button value={'Add friend'} action={()=>{addFriend(friend.user_id)}}/>
                    </div>
                )
            })}
        </div>
    </div>
  )
}
