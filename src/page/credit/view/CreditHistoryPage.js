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
          <div style={{ overflow: 'hidden' }}>
            <span className="fl">
              {/* style={{ width: 'calc(100% - 100px)' }} */}
              {item.billName}
            </span>
            <span className="fr">{item.billCycle}</span>
          </div>
          <span>US$ {item.totalAmount}</span>
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
          className="list-item R-list-item"
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
    for (let key in this.state.billList) {
      res.push(
        <ul key={key} className="list">
          <li className="list-title">{key}</li>
          {this.generateList(this.state.billList[key])}
        </ul>
      );
    }

    return <Fragment>{res}</Fragment>;
  }

  formatHistoryBill(arr) {
    let list = arr;
    if (!list || !list.length) return;
    list.sort((a, b) => Number(a.billYear) - Number(b.billYear));
    let key = list[0].billYear;
    let historyObj = {};
    historyObj[key] = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].billYear === key) {
        historyObj[key].push(list[i]);
      } else {
        key = list[i].billYear;
        historyObj[key] = [list[i]];
      }
    }
    return historyObj;
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
    window.addEventListener('click', function(e) {
      //TODO: click +active 类名
      // if (e.target.className.indexOf('R-list-item') > -1) {
      //   console.dir('666');
      // }
    });
    wrapCheckIsPhone = this.checkIsPhone.bind(_this);
    window.addEventListener('resize', wrapCheckIsPhone);

    creditDao
      .getHistoryList()
      .then(res => {
        let { list } = res.data;
        this.setState({
          billList: this.formatHistoryBill(list),
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
                      <Bill
                        data={curBill}
                        showKeys={[
                          'totalAmount',
                          'remainingAmount',
                          'repaidAmount',
                          'unConfirmedAmount'
                        ]}
                      ></Bill>
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
