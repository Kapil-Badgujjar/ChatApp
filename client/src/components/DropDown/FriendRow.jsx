import React, {useState} from 'react'
import axios from 'axios'
import styles from './DropDown.module.css'
export default function FriendRow({item}) {
    const [buttonText, setButtonText] = useState('Add Friend');
    async function addFriend(){

        if(buttonText == 'Add Friend')
        {
            await axios.post('http://localhost:4800/friends/add-friend',{id: item.user_id}, {withCredentials: true});
            setButtonText('Remove');
        }
        else
        {
            await axios.post('http://localhost:4800/friends/remove-friend',{id: item.user_id}, {withCredentials: true});
            setButtonText('Add Friend');
        } 
    }

  return (
    <>
        <div className={styles.friendDetails}>
            <h3>{item.user_name}</h3>
            <p>{item.email_id}</p>
        </div>
        <div className={styles.addFriend} onClick={()=>{addFriend()}}>{buttonText}</div>
    </>
  )
}
