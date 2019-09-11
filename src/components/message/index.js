import React from  'react';
import {message} from 'antd';

let myMessage = {}

myMessage.error = (content,duration,onClose) =>{
    return message.open({
        content,
        duration,
        onClose,
        icon: <i className="ob-icon icon-error" style={{fontSize:16,color:'#E64545',marginRight:10}}></i>
    })
}

myMessage.info = (content,duration,onClose) =>{
    return message.open({
        content,
        duration,
        onClose,
        icon: <i className="ob-icon icon-info" style={{fontSize:16,color:'#1470CC',marginRight:10}}></i>
    })
}

myMessage.warning = (content,duration,onClose) =>{
    return message.open({
        content,
        duration,
        onClose,
        icon: <i className="ob-icon icon-caution" style={{fontSize:16,color:'#FF7733',marginRight:10}}></i>
    })
}

myMessage.warn = (content,duration,onClose) =>{
    return message.warn(content,duration,onClose)
}

myMessage.loading = (content,duration,onClose) =>{
    return message.loading(content,duration,onClose)
}

myMessage.success = (content,duration,onClose) =>{
    return message.open({
        content,
        duration,
        onClose,
        icon: <i className="ob-icon icon-yes" style={{fontSize:16,color:'#00b300',marginRight:10}}></i>
    })
}

export default myMessage