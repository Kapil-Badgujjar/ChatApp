import React from 'react';
import './Button.css'
export default function Button({value, action}) {
  return (
    <>
      <button className="button-type-1" onClick={(ev)=>{action(ev)}}>{value}</button>
    </>
  )
}
