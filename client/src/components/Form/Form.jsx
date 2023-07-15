import React, { useState } from 'react';
import './Form.css';
import image from '../../assets/signal-app-image.jpg'
export default function Form({formName,childComponents,button,formReference,errorMessage}) {
  return (
    <div className="login-signup-updatePassword-form">
      <img src={image} alt="simple image" />
      <form ref={formReference} className="form">
      <p className="Form-name">{formName}</p>
      <p className='error-message'>{errorMessage}</p>
        {childComponents.map((component,id)=>{
          return <div key={formName+id}>{component}</div>;
        })}
        {button}
      </form>
    </div>
  )
}
