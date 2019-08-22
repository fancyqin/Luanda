import React,{Component} from 'react'
import {Provider} from 'react-redux'
import store from '@/store'

import '@/style/index.scss'



export default class App extends Component {
    render(){
        return <Provider store={store}>
            <div>
                <img src={require('./assets/img/gewgw/Simulato.png')} width="100" />
            hello luanda</div>
        </Provider>
    }
}