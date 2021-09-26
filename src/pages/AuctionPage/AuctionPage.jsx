// eslint-disable-next-line
import React, { useState } from 'react';

import './AuctionPage.css';

const AuctionPage = () => (
  <div className="AuctionPage">
    <h2 className="AuctionPage-title">
      Aucti<span className="AuctionPage-titleColored">on</span>
    </h2>
    <div className="AuctionPage-columns">
      <div className="AuctionPage-leftColumn" />
      <div className="AuctionPage-rightColumn" />
    </div>
  </div>
);

export default AuctionPage;
