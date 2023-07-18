import React, { useState } from 'react'
import axios from 'axios'
import Form from '../components/Form/Form'
import { useRef } from 'react'
import InputBox from '../components/InputBox/InputBox'
import FormLinks from '../components/FormLinks/FormLinks'
import Button from '../components/Button/Button'

export default function ForgotPasswordPage() {
    const formReference = useRef(null);
    const [message, setMessage] = useState('');
    async function forgotPassword(event){
    event.preventDefault();
    let formData = new FormData(formReference.current);
    try{
        const response = await axios.post('http://localhost:4800/user/update-password',formData,{
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(response.status===200){
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
        formName="Forgot Password" 
        childComponents={
          [
            <InputBox name='email_id' type="email" placeholder='Email ID' value="" isRequired={true} />,
            <FormLinks label="Login to account" linkName="Go to login" to='/login'/>,
            <FormLinks label="Don't have an account?" linkName="Register Now" to='/signup'/>,
          ]
        }
        button={<Button value="Find Account"  action={forgotPassword}/>}
        />
    </div>
  )
}
