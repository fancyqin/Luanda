import React, { Component } from 'react';

import {Link} from 'react-router-dom';

export default class CreditListPage extends Component {
    render() {
        return (
            <div>
                <Link to="/detail?id=fwfwfw" >Go To Detail</Link>
                <Link to="/applyCredit" >Add a Credit</Link>
                CreditListPage
            </div>
        )
    }
}
