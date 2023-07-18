import React from 'react'
import './style.css'
import Button from '../components/Button/Button'
import { useNavigate } from 'react-router-dom'
export default function SettingsPage() {
  const navigate = useNavigate();
  return (
    <div className='userProfile'>
      <p className='userProfileBackBtn' onClick={()=>{navigate('/chats')}}>Go back to chats</p>
      <div className='userProfileHeader'>
          <div className='userProfileHeaderLeft'>
            <h1>Kapil Badgujjar</h1>
            <h3>kapilbadgujjar99@gmail.com</h3>
            <p>Registration date: </p>
          </div>
          <div className='userProfileHeaderRight'>
            {/* <img src="#" alt="user profile" /> */}
          </div>
      </div>
      <div className='userProfileMain'>
          <form>
            <div>
              <label htmlFor="username">Username</label>
              <input type='text' name="username" value="Kapil Badgujjar" required/>
            </div>
            <div>
              <label htmlFor="email">Email ID</label>
              <input type='email' name="email" value="kapilbadgujjar99@gmail.com" required/>
            </div>
            <div>
              <label htmlFor="phone">Phone number</label>
              <input type='number' name="phone" value="7988220911" required/>
            </div>
            <div>
              <Button value="Update" />
            </div>
          </form>
      </div>
      <div className='userProfileFooter'>
        <div>
          <span>Help</span>
          <span>Delete Account</span>
          <span>Change Passowrd</span>
          <span>FAQs</span>
          <span>Contact Us</span>
        </div>
      </div>
    </div>
  )
}
