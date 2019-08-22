import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import reducers from '@/reducers'
import configStore from '@/store/configStore'
import LuandaRouter from '@/router'

import 'antd/dist/antd.css'
import '@/style/index.scss'

const store = configStore(reducers)

class App extends Component {
    render(){
        return <Provider store={store}>
            <LuandaRouter />
        </Provider>
    }
}


ReactDOM.render(<App />,document.getElementById('luanda'))