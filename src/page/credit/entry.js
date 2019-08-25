import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import {HashRouter as Router, Route } from 'react-router-dom'
import AddCreditPage from './view/AddCreditPage'
import CreditDetailPage from './view/CreditDetailPage'
import CreditListPage from './view/CreditListPage'

import './index.scss';


class App extends Component {
    render(){
        return <Router>
        <Route path="/" exact component={CreditListPage} />
        <Route path="/add" component={AddCreditPage} />
        <Route path="/detail/:id" component={CreditDetailPage} />

      </Router>
    }
}


ReactDOM.render(<App />,document.getElementById('root'))