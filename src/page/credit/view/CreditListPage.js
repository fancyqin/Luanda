import React, { Component, Fragment, createRef } from 'react';
import { Link } from 'react-router-dom';
import { Tabs } from 'antd';
import Bill from './module/Bill';
import Button from '@/components/button/Button';
import { Modal, Input } from 'antd';

import creditDao from '@/dao/creditDao';

const CREDIT_STATUS = [null, 'Valid', 'Invalid', 'Frozen', 'Expired'];
const AMOUNT_ERROR = {
  required:'Please enter Amount.',
  invalid:'Only number between 0.01 and 9999999.99 are allowed.'
}

export default class CreditListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      creditInfo: {
        totalCredit: 0,
        remainingCredit: 0,
        usedCredit: 0,
        unpaidCredit: 0,
        status: 'Valid'
      },
      billList: [],
      repaymentErr:'',
      repaymentAmount:''
    };
    this.repaymentInput = createRef();
  }

  modalConfirm() {
    //TODO: 跳转凭证上传页
    this.modalCancel();
  }
  modalCancel() {
    this.setState({
      modalVisible:false
    })
  }

  validateAmount(){
    let input = this.repaymentInput.current.input;
    let value = input.value;
    let errMsg = '';
    if(!value.length){
      errMsg = AMOUNT_ERROR.required;
    }else{
      if(!value.match(/^\d+(\.\d{1,2})$/)){
        errMsg = AMOUNT_ERROR.invalid;
      }else{
        try{
          let num = Number(value);
          errMsg = (num<0.01||num>9999999.99)?AMOUNT_ERROR.required:''
        }catch(err){
          errMsg = AMOUNT_ERROR.invalid;
        }
      }
    }
    this.setState({repaymentErr:errMsg})
  }

  componentDidMount() {
    Promise.all([creditDao.getCreditInfo(), creditDao.getBillList()]).then(
      ([creditInfo, billList]) => {
        //XXX:
        // if(creditInfo.data.creditStatus!=='1'){
        //   window.location.href='//crov.com/error/403';
        //   return
        // }
        this.setState({
          creditInfo: creditInfo.data,
          billList: billList.data.list
        });
      }
    );
  }
  render() {
    let { creditInfo, billList, repaymentErr, repaymentAmount } = this.state;
    let creditStatus = creditInfo.status;
    let creditStatusLabel = CREDIT_STATUS[creditStatus];
    let creditInfoClass = '';
    if (creditStatusLabel === 'Invalid')
      creditInfoClass = 'credit-info_invalid';
    else if (creditStatusLabel === 'Frozen' || creditStatusLabel === 'Expired')
      creditInfoClass = 'credit-info_frozen';
    let billLabel = ['已出账单', '未出账单', 'To be Confirmed'];
    return (
      <div className="vo-main-wrap">
        <div className="vo-main credit">
          <div className="vo-main-title">
            <h3>
              Crov Credit
              <span>
                If you have an extension request, please{' '}
                <a href="//www.crov.com/help/contact-us.html">contact us</a>.
              </span>
            </h3>
          </div>

          <div
            className={`credit-info ${creditInfoClass ? creditInfoClass : ''}`}
          >
            <div className="remaining">
              {creditStatus === 2 ? (
                <span className="credit_status">Invalid</span>
              ) : (
                <Fragment>
                  Remaining Credit
                  <h3>
                    US$ {creditInfo.remainingCredit}
                    {creditStatus === 1 ? (
                      ''
                    ) : (
                      <span className="credit_status">{creditStatusLabel}</span>
                    )}
                  </h3>
                </Fragment>
              )}
            </div>
            <div className="credit-info_bottom">
              {creditStatus === 2 ? (
                <div className="unpaid">
                  <span>Remaining Amount of Repayment</span>
                  <p>US$ {creditInfo.unpaidCredit}</p>
                </div>
              ) : (
                <Fragment>
                  <div className="total">
                    <p>US$ {creditInfo.totalCredit}</p>
                    <span>Total Credit</span>
                  </div>
                  <div className="used">
                    <p>US$ {creditInfo.usedCredit}</p>
                    <span>Used Credit</span>
                  </div>
                </Fragment>
              )}
              <div
                className="credit-btns btn-groups"
                style={{ marginTop: creditStatus === 2 ? '32px' : '15px' }}
              >
                <Button
                  type="main"
                  onClick={() => {
                    this.setState({ modalVisible: true });
                  }}
                >
                  Repay Now
                </Button>
                <Link to="/history" className="btn">
                  History Bills
                </Link>
                <a className="btn psw" href="//login.crov.com/payment-password/verification">
                  Payment Password
                </a>
              </div>
            </div>
          </div>

          <div className="credit-main">
            <Tabs type="card" tabBarGutter={0} tabBarStyle={{height:'66px'}}>
              {billList.map((item, idx) => {
                let tabTemp = <div className='tabCard'><p className='tab-title'>{billLabel[idx]}</p></div>;
                if (idx < 2) {
                  tabTemp = <div className='tabCard'><p className='tab-title'>{billLabel[idx]}</p> <span>{item.billCycle}</span></div>;
                }
                return (
                  <Tabs.TabPane tab={tabTemp} key={idx}>
                    <Bill
                      data={item}
                      showKeys={[
                        'remainingAmount',
                        'unConfirmedAmount',
                        'totalAmount',
                        'repaymentDate'
                      ]}
                    ></Bill>
                  </Tabs.TabPane>
                );
              })}
            </Tabs>
          </div>

          <Modal
            title="Repayment"
            visible={this.state.modalVisible}
            closeIcon={(<i className='ob-icon icon-delete'></i>)}
            footer={null}
            width={480}
            maskClosable={false}
            onCancel={()=>this.modalCancel()}
          >
            <div className='modal-content'>
            <div >
              <span className='title'>Used Credit</span>
              <p className='count'>US$ {creditInfo.usedCredit}</p>
            </div>

            <div className='mt-20'>
              <span className='title'>Remaining Amount of Repayment</span>
              <p className='count'>US$ {creditInfo.unpaidCredit}</p>
            </div>

            <div className='mt-20'>
              <p className='title'>Repayment Amount</p>
              <Input ref={this.repaymentInput} className={`repayment-input ${repaymentErr?'has-error':''}`} addonBefore="US$" defaultValue={creditInfo.unpaidCredit} onBlur={()=>{this.validateAmount()}}/>
              { repaymentErr&&
                <div className='unpaid_error'>{repaymentErr}</div>
              }
            </div>
            <div className='btn-groups modal-footer'>
              <Button onClick={()=>this.modalCancel()}>Cancel</Button>
              <Button type='main' onClick={()=>this.modalConfirm()}>Confirm</Button>
            </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
