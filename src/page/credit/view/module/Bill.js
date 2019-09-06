import React, { Fragment } from 'react';

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
    return (
      <div className="bill-detail-item" key={idx}>
        <div className='detail-wrap'>
          {item.list.map((item2, idx2) => {
            let orderTemp;
            if (item2.orderNumber) {
              orderTemp = (
                <Fragment>
                  (Order Number: <a
                    className="orderNumber"
                    href={item2.orderUrl && item2.orderUrl}
                  >
                    {item2.orderNumber}
                  </a> )
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

function generateBill(data, keys) {
  if (!data || !keys || !keys.length) return;

  const {
    remainingAmount,
    unConfirmedAmount,
    totalAmount,
    repaidAmount,
    repaymentDate,
    detail
  } = data;

  let remainingTemp,
    unConfirmedTemp,
    totalTemp,
    repaidTemp,
    repaymentDateTemp,
    detailTemp;

  if (remainingAmount && keys.indexOf('remainingAmount') > -1) {
    remainingTemp = (
      <div className="bill-info-item">
        <span>Remaining Amount of Repayment</span>
        <p>US$ {remainingAmount}</p>
      </div>
    );
  }

  if (unConfirmedAmount && keys.indexOf('unConfirmedAmount') > -1) {
    unConfirmedTemp = (
      <div className="bill-info-item">
        <span>Amount to be confirmed of Repayment</span>
        <p>US$ {unConfirmedAmount}</p>
      </div>
    );
  }

  if (totalAmount && keys.indexOf('totalAmount') > -1) {
    totalTemp = (
      <div className="bill-info-item">
        <span>Total Bill Amount</span>
        <p>US$ {totalAmount}</p>
      </div>
    );
  }

  if (repaidAmount && keys.indexOf('repaidAmount') > -1) {
    repaidTemp = (
      <div className="bill-info-item">
        <span>Repaid Amount of Repayment</span>
        <p>US$ {repaidAmount}</p>
      </div>
    );
  }

  if (repaymentDate && keys.indexOf('repaymentDate') > -1) {
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
      <div className="bill-info">
        <div className="bill-info-detail">
          {keys &&
            keys.map((item, idx) => {
              if (tempObj[item])
                return <Fragment key={idx}>{tempObj[item]}</Fragment>;
            })}
          {/* {remainingTemp && remainingTemp}
          {unConfirmedTemp && unConfirmedTemp}
          {totalTemp && totalTemp}
          {repaymentDateTemp && repaymentDateTemp} */}
        </div>
        {/* TODO: repaid 状态展示判断 */}
        {/* <div className="bill-info_repaid">Repaid</div> */}
      </div>
      {detailTemp && detailTemp}
    </div>
  );
}

export default function Bill({ data, showKeys }) {
  return <Fragment>{generateBill(data, showKeys)}</Fragment>;
}