import React from 'react'
import './Style.css'
import image from '../assets/chatAppLogo.jpg'
import Button from '../components/Button/Button'
import { Link, Outlet } from 'react-router-dom'
export default function HomePage() {
  return (
    <div className="home-container">
        <div className="home-inner-container">
            <div className="home-inner-container-left">
              <img src={image} alt="Friends chatting image"/>
            </div>
            <div className="home-inner-container-right">
              <h2>Connect with Frineds</h2>
              <h3>Welcome to Signal chat app</h3>
              <p>We're excited to have you here. Whether you're looking for a friendly conversation, seeking assistance, or simply want to explore different topics, we're here to help.</p>
              <Link to='/login'>Login to your account -&gt;</Link>
              {/* <h3>Get Connect with friends with</h3> */}
            </div>
        </div>
    </div>
  )
}
