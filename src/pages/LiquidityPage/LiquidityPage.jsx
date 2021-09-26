import React from 'react';

import Mockup from './LiquidityPageMockup.png';

import './LiquidityPage.css';

const LiquidityPage = () => (
  <div className="LiquidityPage">
    <h2 className="LiquidityPage-title">
      Liqui<span className="LiquidityPage-titleColored">dity</span>
    </h2>
    <div className="LiquidityPage-columns">
      <div className="LiquidityPage-leftColumn">
        <img src={Mockup} alt="mockup" className="LiquidityPage-mockup" />
      </div>
      <div className="LiquidityPage-rightColumn" />
    </div>
  </div>
);

export default LiquidityPage;
