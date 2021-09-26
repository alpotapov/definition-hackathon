import React from 'react';

import usePolyPool from '../../hooks/usePolyPool';

import CanTrade from '../../components/CanTrade/CanTrade';
import TradeSettings from '../../components/TradeSettings/TradeSettings';
import PriceChart from '../../components/PriceChart/PriceChart';

import './TradePage.css';

const TradePage = () => {
  const { isTrader } = usePolyPool();
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
          <TradeSettings />
        </div>
        <div className="TradePage-rightColumn">
          <PriceChart />
        </div>
      </div>
    </div>
  );
};

export default TradePage;
