import React,{Component} from 'react'
import ReactDOM from 'react-dom'

import 'antd/dist/antd.css';

class App extends Component {
    render(){
        return <div>Address<img src={require('@/assets/img/gewgw/Simulato.png')} /></div>
    }
}


ReactDOM.render(<App />,document.getElementById('root'))