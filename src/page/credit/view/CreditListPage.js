import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Tabs } from 'antd';
import Bill from '../components/Bill';
import Button from '@/components/button/Button';
import { Modal, Input } from 'antd';

import creditDao from '@/dao/creditDao';

const CREDIT_STATUS = [null, 'Valid', 'Invalid', 'Frozen', 'Expired'];
const CREDIT_RECORD_STATUS = [
  null,
  'Payment',
  'Refund',
  'Repayment',
  'Carried Over'
];

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
        status: 'normal'
      },
      billList: []
    };
  }

  tabChange(e) {
    console.log(e);
  }

  generateBillDetail(arr) {
    let detailTemp = arr.map((item, idx) => {
      let statusLabel = CREDIT_RECORD_STATUS[item.status];
      return (
        <div className="bill-detail-item" key={idx}>
          <div>
            {item.list.map((item2, idx2) => {
              let orderTemp;
              if (item2.orderNumber) {
                orderTemp = (
                  <Fragment>
                    ( Order Number:&nbsp;
                    <a href={item2.orderUrl && item2.orderUrl}>
                      {item2.orderNumber}
                    </a>
                    )
                  </Fragment>
                );
              }
              return (
                <div key={idx2}>
                  <a href={item2.sellerUrl}>{item2.sellerName}</a>
                  {orderTemp && orderTemp}
                </div>
              );
            })}
            <div className="info">
              <span style={{ marginRight: '10px' }}>{item.billDate}</span>
              <span
                className={`record_${
                  statusLabel === 'Carried Over' ? 'CarriedOver' : statusLabel
                }`}
              >
                {statusLabel}
              </span>
            </div>
          </div>
          <div
            className={`price ${
              statusLabel === 'Repayment' ? 'price-repayment' : ''
            }`}
          >
            {' '}
            {statusLabel === 'Repayment' ? '-US$' : 'US$'} {item.billAmount}
          </div>
        </div>
      );
    });

    return <div className="bill-detail">{detailTemp && detailTemp}</div>;
  }

  generateBill(data) {
    const {
      remainingAmount,
      unConfirmedAmount,
      totalAmount,
      repaymentDate,
      detail
    } = data;

    let remainingTemp,
      unConfirmedTemp,
      totalTemp,
      repaymentDateTemp,
      detailTemp;

    if (remainingAmount) {
      remainingTemp = (
        <div className="bill-info-item">
          <span>Remaining Amount of Repayment</span>
          <p>US$ {remainingAmount}</p>
        </div>
      );
    }

    if (unConfirmedAmount) {
      unConfirmedTemp = (
        <div className="bill-info-item">
          <span>Amount to be confirmed of Repayment</span>
          <p>US$ {unConfirmedAmount}</p>
        </div>
      );
    }

    if (totalAmount) {
      totalTemp = (
        <div className="bill-info-item">
          <span>Amount to be confirmed of Repayment</span>
          <p>US$ {unConfirmedAmount}</p>
        </div>
      );
    }

    if (repaymentDate) {
      repaymentDateTemp = (
        <div className="bill-info-item">
          <span>Repayment Date</span>
          <p>{repaymentDate}</p>
        </div>
      );
    }

    if (detail && detail.length) {
      detailTemp = generateBillDetail(detail);
    }

    return (
      <div className="bill">
        <div className="bill-info">
          <div className="bill-info-detail">
            {remainingTemp && remainingTemp}
            {unConfirmedTemp && unConfirmedTemp}
            {totalTemp && totalTemp}
            {repaymentDateTemp && repaymentDateTemp}
          </div>
          <div className="bill-info_repaid">Repaid</div>
        </div>
        {detailTemp && detailTemp}
      </div>
    );
  }

  modalConfirm() {
    //TODO: 跳转支付页
    this.modalCancel();
  }
  modalCancel() {
    this.setState({
      modalVisible:false
    })
  }

  componentWillMount() {
    Promise.all([creditDao.getCreditInfo(), creditDao.getBillList()]).then(
      ([creditInfo, billList]) => {
        this.setState({
          creditInfo: creditInfo.data.data,
          billList: billList.data.data.list
        },()=>{
          console.log(this.state.creditInfo,this.billList)
        });
      }
    );
  }
  render() {
    let { creditInfo, billList } = this.state;
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
        <div className="vo-main">
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
                    console.log('test');
                    this.setState({ modalVisible: true });
                  }}
                >
                  Repay Now
                </Button>
                <Link to="/history" className="btn">
                  History Bills
                </Link>
                {/* TODO: href */}
                <a className="btn psw" href="">
                  Payment Password
                </a>
              </div>
            </div>
          </div>

          <div className="credit-main">
            <Tabs onChange={this.tabChange} type="card" tabBarGutter={0} tabBarStyle={{height:'66px'}}>
              {billList.map((item, idx) => {
                let tabTemp = <div className='tabCard'><p className='tab-title'>{billLabel[idx]}</p></div>;
                if (idx < 2) {
                  //TODO: 使用 renderTabBar 封装标签头
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
              <Input addonBefore="US$" defaultValue={creditInfo.unpaidCredit} style={{marginTop:'5px',width:'250px'}}/>
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
