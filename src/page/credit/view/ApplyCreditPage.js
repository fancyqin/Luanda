import React, { Component } from 'react'
import CreditDao from '@/dao/CreditDao';

import '../styles/ApplyCredit.scss'

import ApplyCreditFrom from './module/ApplyCreditForm'

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
        document.querySelector('body').classList.add('react-apply-credit')
        
        CreditDao.getApplyCredit().then(result=> {
            let {data} = result;
            let {creditStatus} = data;
            // if(creditStatus === '1'){
            //     history.replace('/')
            // }
            this.setState({
                pageLoading: false,
                data
            })

        }).catch(error => {
            console.log(error)
        })
    }

    componentWillUnmount(){
        document.querySelector('body').classList.remove('react-apply-credit')
    }

    render() {
        let {pageLoading,data} = this.state;
        let {creditStatus} = data;
        return (
            <div className="vo-main-wrap apply-credit">
                <div className="vo-main">
                    {!pageLoading && <div>
                        <div className="vo-main-title">
                            <div className="vo-main-title-text">Apply for Crov Credit</div>
                        </div>
                        <div className="vo-block">
                            <ApplyCreditFrom initValue={data} />
                        </div>
                    </div>}
                </div>
            </div>
            
        )
    }
}


export default ApplyCreditPage
