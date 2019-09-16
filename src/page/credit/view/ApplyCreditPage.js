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
        document.querySelector('body').classList.add('react-apply-credit')
    }
    
    componentDidMount(){
        let {history} = this.props;
        
        CreditDao.getApplyCredit().then(result=> {
            let {data} = result;
            let {creditStatus} = data;
            // if(creditStatus === '1'){
            //     //审核通过跳转至账期列表页
            //     history.replace('/')
            // }
            // if(creditStatus === '2'){
            //     //审核中状态显示侧边栏
            //     document.querySelector('body').classList.remove('react-apply-credit')
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
        let {history} = this.props;
        let {pageLoading,data} = this.state;
        let {creditStatus} = data;
        let applying = creditStatus === '2';
        return (
            <div className={`vo-main-wrap apply-credit ${applying && 'apply-credit-applying'}`} >
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
