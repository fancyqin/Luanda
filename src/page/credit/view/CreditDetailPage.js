import React, { Component } from 'react'

export default class CreditDetailPage extends Component {
    constructor(props){
        super(props);
        
    }
    render() {
        let {match} = this.props;
        return (
            <div>
                CreditDetailPage , id is {match.params.id}
            </div>
        )
    }
}
