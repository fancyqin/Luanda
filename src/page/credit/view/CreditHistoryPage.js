import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import Bill from './module/Bill';
import creditDao from '@/dao/CreditDao';

let wrapCheckIsPhone;

export default class CreditHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      billList: [],
      curBill: {},
      isPhone: false
    };
  }

  changeCurBill(e, item) {
    this.setState({
      curBill: item
    });
  }

  generateList(arr) {
    return arr.map((item, idx) => {
      const temp = (
        <Fragment>
          <div style={{ overflow: 'hidden',marginBottom:'6px' }}>
            <span className="fl">
              {item.billName}
            </span>
            <span className="fr" style={{fontSize:'12px'}}>{item.billCycle}</span>
          </div>
          <span style={{fontSize:'12px'}}>US$ {item.totalAmount}</span>
        </Fragment>
      );
      return this.state.isPhone ? (
        <li className="list-item" key={idx}>
          <Link
            to={{
              pathname: '/detail',
              state: {
                detail: item
              }
            }}
            style={{ display: 'block' }}
          >
            {temp}
          </Link>
        </li>
      ) : (
        <li
          className={`list-item ${
            this.state.curBill.billName === item.billName
              ? 'list-item_active'
              : ''
          }`}
          key={idx}
          onClick={e => this.changeCurBill(e, item)}
        >
          {temp}
        </li>
      );
    });
  }

  generateHistory() {
    //TODO: HistoryObj billYear 乱序
    let res = [];
    // for (let key in this.state.billList) {
    //   res.push(
    //     <ul key={key} className="list">
    //       <li className="list-title">{key}</li>
    //       {this.generateList(this.state.billList[key])}
    //     </ul>
    //   );
    // }
    let { billList } = this.state;
    if (!billList.length) return;
    let year = billList[0].billYear;
    let i = 1;
    let prev = 0;
    while (i < billList.length) {
      if (year === billList[i].billYear) i++;
      else {
        res.push(
          <ul key={year} className="list">
            <li className="list-title">{year}</li>
            {this.generateList(billList.slice(prev, i))}
          </ul>
        );
        year = billList[i].billYear;
        prev = i;
        i++;
      }
    }
    res.push(
      <ul key={year} className="list">
        <li className="list-title">{year}</li>
        {this.generateList(billList.slice(prev, i))}
      </ul>
    );
    // console.log(res)

    return <Fragment>{res}</Fragment>;
  }

  sortList(arr) {
    let list = arr.slice(0);
    if (!list || !list.length) return;
    return list.sort((a, b) => Number(b.billYear) - Number(a.billYear));
  }

  checkIsPhone() {
    let isPhone = window.innerWidth < 768 ? true : false;
    if (this.state.isPhone != isPhone) {
      this.setState({
        isPhone
      });
    }
  }

  componentDidMount() {
    let _this = this;
    this.checkIsPhone();
    wrapCheckIsPhone = this.checkIsPhone.bind(_this);
    window.addEventListener('resize', wrapCheckIsPhone);

    Promise.all([creditDao.getCreditInfo(), creditDao.getHistoryList()])
      .then(([creditInfo, historyList]) => {
        let { status,creditStatus } = creditInfo;
        // XXX:
        if(creditStatus!='1')window.location.href = '/applyCredit'
        if(status!='1'&&status!='3')window.location.href = '//crov.com/error/403';
        let { list } = historyList.data;
        this.setState({
          billList: this.sortList(list),
          curBill: list[0]
        });
      })
      .catch(err => {
        console.warn(err);
      });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', wrapCheckIsPhone);
  }

  render() {
    const { match } = this.props;
    const { curBill, isPhone } = this.state;
    const listTemp = this.generateHistory();
    return (
      <div className="vo-main-wrap">
        <div className="vo-main history">
          <Breadcrumb separator={<i className="ob-icon icon-right"></i>}>
            <Breadcrumb.Item href="/credit">Crov Credit</Breadcrumb.Item>
            <Breadcrumb.Item>History Bills</Breadcrumb.Item>
          </Breadcrumb>
          <div className="vo-main-title">
            <h3>History Bills</h3>
          </div>

          <div className="history-bills">
            <div className="history-list">{listTemp}</div>
            {!isPhone && (
              <div className="history-detail">
                <Route
                  exact={false}
                  path={`${match.path}`}
                  render={() => {
                    return (
                      <Fragment>
                        <Bill
                          data={curBill}
                          showKeys={[
                            'totalAmount',
                            'remainingAmount',
                            'repaidAmount',
                            'unConfirmedAmount'
                          ]}
                        ></Bill>
                      </Fragment>
                    );
                  }}
                ></Route>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
