import {useRef, useState, useContext } from 'react'
import axios from 'axios'
import Form from '../components/Form/Form'
import InputBox from '../components/InputBox/InputBox'
import Button from '../components/Button/Button'
import FormLinks from '../components/FormLinks/FormLinks'
import { useNavigate } from 'react-router-dom'
import Context from '../utils/context'
export default function LoginPage() {
  const {userName, setUserName, userID, setUserID} = useContext(Context);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  let formReference = useRef(null);
  async function login(event){
    event.preventDefault();
    let formData = new FormData(formReference.current);
    try{
      const response = await axios.post('http://localhost:4800/user/login',formData,{
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(response.status===200){
        console.log(response.data);
        setUserName(response.data.user_name);
        setUserID(response.data.user_id);
        navigate('/chats');
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
        formName="Login to your account" 
        childComponents={
          [
            <InputBox name='email_id' type="email" placeholder='Email id' value="" isRequired={true} />,
            <InputBox name='password' type="password" placeholder='Password' value="" isRequired={true} />,
            <FormLinks label="Forgot password?" linkName="Reset Passowrd" to='/forgotpassword'/>,
            <FormLinks label="Don't have an account?" linkName="Register Now" to='/signup'/>,
          ]
        }
        button={<Button value="Login"  action={login}/>}
        />
    </div>
  )
}
