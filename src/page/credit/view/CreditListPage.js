import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Tabs } from 'antd';

import creditDao from '@/dao/creditDao';

export default class CreditListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  generateBill(data) {
    const { remainingAmount, unConfirmedAmount, totalAmount, repaymentDate } = data;
    let remainingTemp = (
      <div>
        <span>Remaining Amount of Repayment</span>
        <p>US$ {remainingAmount}</p>
      </div>
    );
    let unConfirmedTemp = (
      <div>
        <span>Amount to be confirmed of Repayment</span>
        <p>US$ {unConfirmedAmount}</p>
      </div>
    );
    
    if(totalAmount){
      var totalTemp = (
        <div>
          <span>Amount to be confirmed of Repayment</span>
          <p>US$ {unConfirmedAmount}</p>
        </div>
      );
    }

    if(repaymentDate){
      var repaymentDateTemp = (
        <div>
          <span>Repayment Date</span>
          <p>{repaymentDate}</p>
        </div>
      )
    }

    return (
      <div>
        <div className='billInfo'>
          {remainingTemp}
          {unConfirmedTemp}
          {totalTemp}
          {repaymentDateTemp}
        </div>
        
      </div>
    );
  }

  componentWillMount() {
    Promise.all([creditDao.getCreditInfo(), creditDao.getBillList()]).then(
      ([creditInfo, billList]) => {
        this.setState({
          creditInfo: creditInfo.data,
          billList: billList.data
        });
      }
    );
  }
  render() {
    let { creditInfo, billList } = this.state;
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

          <div className="credit-info">
            <div className="remaining">
              Remaining Credit
              <h3>US$ {creditInfo.remainingCredit}</h3>
            </div>
            <div className="credit-info_bottom">
              <div className="total">
                <p>US$ {creditInfo.totalCredit}</p>
                <span>Total Credit</span>
              </div>
              <div className="used">
                <p>US$ {creditInfo.usedCredit}</p>
                <span>Used Credit</span>
              </div>
              <div className="credit-btns">
                <button>Repay Now</button>
                <Link to="">
                  <button>Repay Now</button>
                </Link>
                <button>Payment Password</button>
              </div>
            </div>
          </div>

          <div className="credit-main">
            <Tabs onChange={this.tabChange} type="card">
              {billList.map((item, idx) => {
                let tabTemp = billLabel[idx];
                if (idx < 2) {
                  //TODO: tab label
                  tabTemp = <div>{billLabel[idx]} date</div>;
                }
                return (
                  <Tabs.TabPane tab={tabTemp} key={idx}>
                    {this.generateBill(item)}
                  </Tabs.TabPane>
                );
              })}
            </Tabs>
          </div>
        </div>

        {/* <Link to="/detail?id=fwfwfw" >Go To Detail</Link>
                <Link to="/applyCredit" >Add a Credit</Link>
                CreditListPage */}
      </div>
    );
  }
}
