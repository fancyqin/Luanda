import React from 'react';
import Bill from './module/Bill';
import { Breadcrumb } from 'antd';

function CreditDetailPage(props) {
  const { detail, showKeys, location, history } = props;
  let data;
  try{
    data = Object.assign({}, detail);
    if (!detail) {
      let { state } = location;
      if (state.detail) data = state.detail;
    }
  }catch(err){
    data = undefined;
  }
  if(!data)history.replace('/');
  return (
    <div className="vo-main-wrap">
      <Breadcrumb separator={<i className="ob-icon icon-right"></i>}>
        <Breadcrumb.Item href="/credit/history">History Bills</Breadcrumb.Item>
        <Breadcrumb.Item>Credit Detail</Breadcrumb.Item>
      </Breadcrumb>
      <div className="vo-main billDetail">
        <Bill
          data={data}
          showKeys={
            showKeys || [
              'totalAmount',
              'remainingAmount',
              'repaidAmount',
              'unConfirmedAmount'
            ]
          }
        ></Bill>
      </div>
    </div>
  );
}

export default CreditDetailPage;
