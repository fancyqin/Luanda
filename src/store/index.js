import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

const middlewares = [thunk]

export default function configureStore(reducer){
    const store = createStore(reducer, {},  applyMiddleware(...middlewares))
    return store
}