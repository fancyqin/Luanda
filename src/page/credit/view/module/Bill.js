import React, { Fragment } from 'react';
import {formtDollar} from '@/utils/currency';

const CREDIT_RECORD_STATUS = [
  null,
  'Payment',
  'Refund',
  'Repayment',
  'Carried Over'
];
const avaliableKeys = [
  'remainingAmount',
  'unConfirmedAmount',
  'totalAmount',
  'repaidAmount',
  'repaymentDate',
  'status'
];

function generateBillDetail(arr) {
  let detailTemp = arr.map((item, idx) => {
    let statusLabel = CREDIT_RECORD_STATUS[item.status];
    /**
     * 1 payment ; 2 refund ; 3 repayment ; 4 carried over ;
     * payment || refund 展示 order seller
     * carriedOver 展示结转自的月度账单的账单名称
     * repayment 展示 Repayment
     *
     * */ 
    let nameTemp;
    switch (item.status){
      case '1':
      case '2':
        if(item.list){
          nameTemp = item.list.map((item2, idx2) => {
            let orderTemp;
            if (item2.orderNumber) {
              orderTemp = (
                <Fragment>
                  (Order Number:{' '}
                  <a
                    className="orderNumber"
                    href={item2.orderUrl && item2.orderUrl}
                  >
                    {item2.orderNumber}
                  </a>{' '}
                  )
                </Fragment>
              );
            }
            return (
              <div key={idx2} className="order">
                <a href={item2.sellerUrl} className="seller">
                  {item2.sellerName}
                </a>
                {orderTemp && orderTemp}
              </div>
            );
          })
        }
        break;
      case '3':
        nameTemp = 'Repayment';
        break;
      case '4':
        // TODO: carried over 显示结转账单名称
        nameTemp = item.carriedOVerBillName

    }
    return (
      <div className="bill-detail-item" key={idx}>
        <div className="detail-wrap">
          {/* {item.list &&
            item.list.map((item2, idx2) => {
              let orderTemp;
              if (item2.orderNumber) {
                orderTemp = (
                  <Fragment>
                    (Order Number:{' '}
                    <a
                      className="orderNumber"
                      href={item2.orderUrl && item2.orderUrl}
                    >
                      {item2.orderNumber}
                    </a>{' '}
                    )
                  </Fragment>
                );
              }
              return (
                <div key={idx2} className="order">
                  <a href={item2.sellerUrl} className="seller">
                    {item2.sellerName}
                  </a>
                  {orderTemp && orderTemp}
                </div>
              );
            })} */}
            {nameTemp&&nameTemp}
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
            statusLabel === 'Repayment'||statusLabel === 'Refund' ? 'price-repayment' : ''
          }`}
        >
          {formtDollar(item.billAmount)}
          {/* {statusLabel === 'Repayment' ? '-US$' : 'US$'} {} */}
        </div>
      </div>
    );
  });

  return <div className="bill-detail">{detailTemp && detailTemp}</div>;
}

function generateBill(data, keys) {
  if (!data || !keys || !keys.length) return;

  const {
    remainingAmount,
    unConfirmedAmount,
    totalAmount,
    repaidAmount,
    repaymentDate,
    detail,
    billStatus
  } = data;

  let remainingTemp,
    unConfirmedTemp,
    totalTemp,
    repaidTemp,
    repaymentDateTemp,
    detailTemp;

  if (remainingAmount!=undefined && keys.indexOf('remainingAmount') > -1) {
    remainingTemp = (
      <div className="bill-info-item">
        <span>Remaining Amount of Repayment</span>
        <p>{formtDollar(remainingAmount)}</p>
      </div>
    );
  }

  if (unConfirmedAmount!=undefined && keys.indexOf('unConfirmedAmount') > -1) {
    unConfirmedTemp = (
      <div className="bill-info-item">
        <span>Amount to be confirmed of Repayment</span>
        <p>{formtDollar(unConfirmedAmount)}</p>
      </div>
    );
  }

  if (totalAmount!=undefined && keys.indexOf('totalAmount') > -1) {
    totalTemp = (
      <div className="bill-info-item">
        <span>Total Bill Amount</span>
        <p>{formtDollar(totalAmount)}</p>
      </div>
    );
  }

  if (repaidAmount!=undefined && keys.indexOf('repaidAmount') > -1) {
    repaidTemp = (
      <div className="bill-info-item">
        <span>Repaid Amount of Repayment</span>
        <p>{formtDollar(repaidAmount)}</p>
      </div>
    );
  }

  if (repaymentDate!=undefined && keys.indexOf('repaymentDate') > -1) {
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

  const tempObj = {
    remainingAmount: remainingTemp,
    unConfirmedAmount: unConfirmedTemp,
    totalAmount: totalTemp,
    repaidAmount: repaidTemp,
    repaymentDate: repaymentDateTemp
  };
  return (
    <div className="bill">
      <div className="bill-title">
        <span>
          <big>{data.billName}</big>
          <span className="cycle">{data.billCycle}</span>
        </span>
        <span className="date">Repayment Date: {data.repaymentDate}</span>
      </div>
      <div className="bill-info">
        <div className="bill-info-detail">
          {keys &&
            keys.map((item, idx) => {
              if (tempObj[item])
                return <Fragment key={idx}>{tempObj[item]}</Fragment>;
            })}
        </div>
        {billStatus==2 && <div className="bill-info_repaid">Repaid</div>}
      </div>
      {detailTemp && detailTemp}
    </div>
  );
}

export default function Bill({ data, showKeys }) {
  return <Fragment>{generateBill(data, showKeys)}</Fragment>;
}
