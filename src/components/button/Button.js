import React from 'react';

export default function Button({type,children,onClick}){
  return (
    <button className={`btn ${type?'btn-'+type:''}`} onClick={onClick}>
      {children}
    </button>
  )
}