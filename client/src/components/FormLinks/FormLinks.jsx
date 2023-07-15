import React from 'react'
import { Link } from 'react-router-dom';
import './formLinks.css';
export default function FormLinks({label, linkName, to}) {
  return (
    <div className='formLinks'>
        <span >{label}</span>
        <Link to={to}>{linkName}</Link>
    </div>
  )
}
