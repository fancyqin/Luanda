import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute,browserHistory } from 'react-router'
import AddCreditPage from './view/AddCreditPage'
import CreditDetailPage from './view/CreditDetailPage'
import CreditListPage from './view/CreditListPage'



import '@/common.scss';

class App extends Component {
    render(){
        return <Router history={browserHistory}>
        <Route path="/credit"  component={CreditListPage} />>
        <Route path="/credit/add" component={AddCreditPage} />
        <Route path="/credit/detail" component={CreditDetailPage} />
      </Router>
    }
}


ReactDOM.render(<App />,document.getElementById('root'))