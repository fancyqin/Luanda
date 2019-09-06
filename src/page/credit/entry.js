import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ApplyCreditPage from './view/ApplyCreditPage';
import CreditDetailPage from './view/CreditDetailPage';
import CreditListPage from './view/CreditListPage';
import CreditHistoryPage from './view/CreditHistoryPage';
// import NotFoundPage from '@/components/noFound/NoFoundPage'
import '../../styles/ant.less'
import './index.scss';

class App extends Component {
  render() {
    return (
      <Router basename="/credit">
        <Route path="/" exact component={CreditListPage} />
        <Route path="/applyCredit" component={ApplyCreditPage} />
        <Route path="/detail" component={CreditDetailPage} />
        <Route exact={false} path="/history" component={CreditHistoryPage}/>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
