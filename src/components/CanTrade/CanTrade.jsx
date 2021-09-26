import React from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

import './CanTrade.css';

// eslint-disable-next-line no-unused-vars, react/prop-types
const CanTrade = ({ isTrader }) => {
  console.log({ isTrader });
  return (
    <div className="CanTrade">
      <div className="CanTrade-icon">
        {isTrader ? <CheckCircleOutlineIcon /> : <CancelIcon />}
      </div>
      <div className="CanTrade-text">
        {isTrader ? 'Can trade' : "Can't trade"}
      </div>
    </div>
  );
};

export default CanTrade;
