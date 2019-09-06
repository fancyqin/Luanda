import React from 'react';

export default function Button({type,children,onClick,style}){
  return (
    <button className={`btn ${type?'btn-'+type:''}`} onClick={onClick} style={style}>
      {children}
    </button>
  )
}