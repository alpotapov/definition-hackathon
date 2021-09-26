import React, { useState } from 'react';

import usePolyPool from '../../hooks/usePolyPool';
import useApproval from '../../hooks/useApproval';

import CanTrade from '../../components/CanTrade/CanTrade';
import TradeSettings from '../../components/TradeSettings/TradeSettings';
import PriceChart from '../../components/PriceChart/PriceChart';
import ApproveForm from '../../components/ApproveForm/ApproveForm';

import './TradePage.css';

const TradePage = () => {
  const { isTrader } = usePolyPool();

  const [tokenToSell, setTokenToSell] = useState(
    '0xB223818360b89a0FA05df1D6b80dD749d92aF571'
  );

  const { approve } = useApproval(tokenToSell);

  const [approvedAmount, setApprovedAmount] = useState(0);
  const onApprovedAmountChange = (evt) => {
    setApprovedAmount(evt.target.value);
  };
  const sendApproved = async () => {
    const numApprovedAmount = Number.parseInt(approvedAmount, 10);
    const result = await approve(numApprovedAmount);
    console.log({ approvedResult: result });
  };
  return (
    <div className="TradePage">
      <div className="TradePage-header">
        <h2 className="TradePage-title">
          Tra<span className="TradePage-titleColored">de</span>
        </h2>
        <CanTrade isTrader={isTrader} />
      </div>
      <div className="TradePage-columns">
        <div className="TradePage-leftColumn">
          <TradeSettings
            setTokenToSell={setTokenToSell}
            tokenToSell={tokenToSell}
          />
          <ApproveForm
            approvedAmount={approvedAmount}
            onApprovedAmountChange={onApprovedAmountChange}
            sendApproved={sendApproved}
          />
        </div>
        <div className="TradePage-rightColumn">
          <PriceChart />
        </div>
      </div>
    </div>
  );
};

export default TradePage;
