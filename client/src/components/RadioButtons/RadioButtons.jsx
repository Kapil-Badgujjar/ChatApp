import React from 'react'
import './RadioButtons.css'
export default function RadioButtons({label, options}) {
  return (
    <div className="Gender-radio-button">
        <span>{label} : </span>
        {
            options.map((item,id)=>{
                return(
                        <label key={item.label+"rbl"}>
                            <input type='radio' name={item.name} value={item.label}/>
                            {item.label}
                        </label>
                )
            })
        }
    </div>
  )
}
