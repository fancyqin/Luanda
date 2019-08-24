import React,{Component} from 'react'
import ReactDOM from 'react-dom'

import '@/common.scss';

class App extends Component {
    render(){
        return <div>Address<img src={require('@/assets/img/gewgw/Simulato.png')} /></div>
    }
}


ReactDOM.render(<App />,document.getElementById('root'))