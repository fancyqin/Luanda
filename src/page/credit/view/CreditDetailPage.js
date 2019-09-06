import React from 'react';
import Bill from '../components/Bill';

function CreditDetailPage(props) {
  const { detail, showKeys, location } = props;
  let data = Object.assign({}, detail);
  if (!detail) {
    let { state } = location;
    if (state.detail) data = state.detail;
  }
  return (
    <div style={{padding:'20px'}}>
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
  );
}

export default CreditDetailPage;
