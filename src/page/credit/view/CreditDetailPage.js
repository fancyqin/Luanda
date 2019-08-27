import React, { Component } from 'react'
import parse from 'url-parse';
export default class CreditDetailPage extends Component {
    constructor(props){
        super(props);

    }
    render() {
        let {location} = this.props;
        let parseQuery = parse(location.search,true).query
        return (
            <div>
                CreditDetailPage , id is {parseQuery.id}
            </div>
        )
    }
}
