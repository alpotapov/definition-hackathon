import React from 'react';

import Mockup from './CreateSwapPageMockup.png';

import './CreateSwapPage.css';

const CreateSwapPage = () => (
  <div className="CreateSwapPage">
    <h2 className="CreateSwapPage-title">
      Create <span className="CreateSwapPage-titleColored">Swap</span>
    </h2>
    <div className="CreateSwapPage-columns">
      <div className="CreateSwapPage-leftColumn">
        <img src={Mockup} alt="mockup" className="CreateSwapPage-mockup" />
      </div>
      <div className="CreateSwapPage-rightColumn" />
    </div>
  </div>
);

export default CreateSwapPage;
