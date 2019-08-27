import React, { Component } from 'react'
import CreditDao from '@/dao/CreditDao';

class ApplyCreditPage extends Component {
    constructor(props){
        super(props)
    }
    
    componentDidMount(){
        CreditDao.getApplyCredit().then(result=> {
            let {data,status} = result.data;
            
        }).catch(error => {
            console.log(error)
        })
    }

    render() {
        return (
            <div>
                ApplyCreditPage
            </div>
        )
    }
}


export default ApplyCreditPage
