import React, { useContext } from 'react';
import axios from 'axios'
import image from '../../assets/chatAppLogo.jpg'
import './Nabar.css';
import Notification from '../../assets/bell-ring.png'
import Button from '../Button/Button';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Context from '../../utils/context';

export default function Navbar() {
  const {userName, setUserName} = useContext(Context);
  const navigate = useNavigate();
  async function logout(){
    try{
      const response = await axios.get('http://localhost:4800/user/logout',{withCredentials: true});
      if(response.status == 200){
        setUserName(undefined);
        navigate('/login');
      }
    } catch(error){
      console.log(error.message);
    }
  }
  return (
    <>
      <div className="Navbar-container">
          <div className="Navbar-container-left-side" >
              <img src={image} alt="logo" onClick={()=>{navigate('/')}}/>
              <div className="Logo" onClick={()=>{navigate('/')}}>Signal</div>
          </div>
          { !userName && <div>Help</div> }
          { userName && <div className="Navbar-container-right-side">
              <img src={Notification} alt="Notification" />
              <Link to='/settings'>{userName}</Link>
              <span>Help</span>
              <Button value="Logout" action={logout} />
          </div> }
      </div>
      <Outlet />
    </>
  )
}
