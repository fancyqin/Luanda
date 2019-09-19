import React from 'react';

export default function NoRecord() {
  return (
    <div className="no-result-wrap">
      <div className="no-result">
        <i className="ob-icon icon-caution" />
        No records found.
      </div>
    </div>
  );
}
