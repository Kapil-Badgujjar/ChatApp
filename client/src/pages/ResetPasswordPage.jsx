import React, { useState } from 'react'
import axios from 'axios'
import Form from '../components/Form/Form'
import { useRef } from 'react'
import InputBox from '../components/InputBox/InputBox'
import FormLinks from '../components/FormLinks/FormLinks'
import Button from '../components/Button/Button'
import { useNavigate, useParams } from 'react-router-dom'

export default function ResetPasswordPage() {
  const navigate = useNavigate();
    const {token} = useParams('token')
    const formReference = useRef(null);
    const [message, setMessage] = useState('');
    async function resetPassword(event){
    event.preventDefault();
    let formData = new FormData(formReference.current);
    try{
        const response = await axios.post(`http://localhost:4800/user/reset-password/${token}`,formData,{
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(response.status === 200){
        console.log(response);
        console.log(response.data);
        navigate('/login');
      } else {
        setMessage(response.data);
        setTimeout(function() { setMessage('') }, 2000);
      }
    }
    catch (error){
      setMessage(error.response.data);
      setTimeout(function(){ setMessage('') },2000);
    }
    }
  return (
    <div>
        <Form 
        formReference={formReference}
        errorMessage={message}
        formName="Reset Password" 
        childComponents={
          [
            <InputBox name='newPassword' type="password" placeholder='New Password' value="" isRequired={true} />,
            <InputBox name='confirmPassword' type="text" placeholder='Confirm Password' value="" isRequired={true} />,
            <FormLinks label="Login to account" linkName="Go to login" to='/login'/>,
            <FormLinks label="Don't have an account?" linkName="Register Now" to='/signup'/>,
          ]
        }
        button={<Button value="Reset"  action={resetPassword}/>}
        />
    </div>
  )
}
