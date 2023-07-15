import React, { useState } from 'react'
import './InputBox.css'
export default function InputBox({labelName, name, type, placeholder, value, isRequired}) {
    const [inputBoxValue, setInputBoxValue] = useState(value);
  return (
    <div className="InputBox">
        {labelName && <span>{labelName}</span>}
        <input type={type} name={name} placeholder={placeholder} value={inputBoxValue} required={isRequired ? "required" : ""} onChange={(event)=>{setInputBoxValue(event.target.value)}} />
    </div>
  )
}
