import React, { useRef, useState } from 'react'
import axios from 'axios'
import Form from '../components/Form/Form'
import InputBox from '../components/InputBox/InputBox'
import Button from '../components/Button/Button'
import FormLinks from '../components/FormLinks/FormLinks'
import RadioButtons from '../components/RadioButtons/RadioButtons'
import { useNavigate } from 'react-router-dom'
export default function SignupPage() {
  let formReference = useRef(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  async function signup(event){
    event.preventDefault();
    let formData = new FormData(formReference.current);
    console.log(formData);
    try{
      const response = await axios.post('http://localhost:4800/user/signup', formData,{
        withCredentials: true,
        headers : {
          'Content-Type': 'application/json',
        }
      })
      if(response.status === 200){
        navigate('/login');
      }

    } catch(error) {
      setMessage(error.response.data);
      setTimeout(function(){ setMessage(''); }, 2000);
    }
  }
  return (
    <div>

        <Form 
        formName="Create new account"
        errorMessage={message}
        formReference={formReference}
        childComponents={
          [
          <InputBox name='name' type="text" placeholder='Name' value="" isRequired={true} />,
          <InputBox name='email_id' type="text" placeholder='Email id' value="" isRequired={true} />,
          <InputBox name='phone' type="number" placeholder='Phone Number' value="" isRequired={true} />,
          <InputBox name='dob' type="date" value="" isRequired={true} />,
          <InputBox name='password' type="password" placeholder='Password' value="" isRequired={true} />,
          <InputBox name='confirmPassword' type="text" placeholder='Confirm Password' value="" isRequired={true} />,
          <RadioButtons label="Gender " options={[{name: 'gender', label: 'Male'},{name: 'gender', label: 'Female'}]} />,
          <FormLinks label="Already have an account!" linkName="Login" to='/login'/>
          ]
        } 
        button={<Button value="Signup"  action={signup}/>}
        />
    </div>
  )
}
