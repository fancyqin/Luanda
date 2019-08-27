import React, { Component } from 'react'
import CreditDao from '@/dao/CreditDao';

import '../styles/ApplyCredit.scss'

class ApplyCreditPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            pageLoading: true,
            data:{}
        }
    }
    
    componentDidMount(){
        let {history} = this.props;
        CreditDao.getApplyCredit().then(result=> {
            let {data,status} = result.data;
            let {creditStatus} = data;
            if(status === '2'){
                // window.location.replace('/error/403')
            }
            if(creditStatus === '1'){
                history.replace('/')
            }
            this.setState({
                pageLoading: false,
                data
            })

        }).catch(error => {
            console.log(error)
        })
    }

    render() {
        let {pageLoading,data} = this.state;
        let {creditStatus} = data;
        return (
            <div className="vo-main-wrap">
                <div className="apply-credit">
                    {!pageLoading && <div>
                        <h2 className="ac-title">Apply for Crov Credit</h2>
                        
                    </div>}
                </div>
            </div>
            
        )
    }
}


export default ApplyCreditPage
