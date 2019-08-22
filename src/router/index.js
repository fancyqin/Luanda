import React from 'react'
import {Router,Route} from 'react-router'
import OrderReviewPage from '@/views/OrderReview/OrderReviewPage'
import HomePage from '@/views/Home/HomePage'

export default class LuandaRouter extends React.Component{
    render(){
        return(
            <Router>
                <Route path="/" component={HomePage}>
                    <Route path="orderReview" component={OrderReviewPage} >
                    
                    </Route>
                </Route>
            </Router>
        )
    }
}