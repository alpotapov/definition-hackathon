// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import { Button, InputLabel, TextField } from '@mui/material';

import ApproveForm from '../../components/ApproveForm/ApproveForm';

import usePolyPool, { polyPoolAddress } from '../../hooks/usePolyPool';
import useSimpleErc20 from '../../hooks/useSimpleErc20';

import './AuctionPage.css';

const AuctionPage = () => {
  const { maxBid, yourCurrentBid, doBid, equalizationData, equalize } =
    usePolyPool();
  const { approve } = useSimpleErc20();

  const [yourBid, setYourBid] = useState(0);
  const [isValidBid, setIsValidBid] = useState(true);
  const onYourBidChange = (evt) => {
    setIsValidBid(true);
    setYourBid(evt.target.value);
  };

  useEffect(() => {
    setYourBid(yourCurrentBid);
  }, [yourCurrentBid]);

  const sendBid = async () => {
    const numYourBid = Number.parseInt(yourBid, 10);
    const numMaxBid = Number.parseInt(maxBid, 10);

    if (numYourBid <= numMaxBid) {
      console.log('send MORE!');
      setIsValidBid(false);
      return;
    }

    const result = await doBid(numYourBid);
    console.log({ result });
  };

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
    <div className="AuctionPage">
      <h2 className="AuctionPage-title">
        Aucti<span className="AuctionPage-titleColored">on</span>
      </h2>
      <div className="AuctionPage-columns">
        <div className="AuctionPage-leftColumn">
          <div>
            <InputLabel id="addressPool">Address Pool</InputLabel>
            <TextField
              fullWidth
              id="addressPool"
              variant="outlined"
              value={polyPoolAddress}
            />
            <InputLabel id="maxBid">Max Bid</InputLabel>
            <TextField
              fullWidth
              disabled
              id="maxBid"
              variant="outlined"
              value={maxBid}
            />
            <InputLabel id="yourBid">Your Bid</InputLabel>
            <TextField
              error={!isValidBid}
              fullWidth
              id="yourBid"
              variant="outlined"
              value={yourBid}
              onChange={onYourBidChange}
            />
          </div>
          <div className="AuctionPage-bidButton">
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={sendBid}
            >
              Bid
            </Button>
          </div>

          <ApproveForm
            approvedAmount={approvedAmount}
            onApprovedAmountChange={onApprovedAmountChange}
            sendApproved={sendApproved}
          />
        </div>
        <div className="AuctionPage-rightColumn">
          <p>Equalize</p>
          <Button
            fullWidth
            disabled={!equalizationData.canEqualize}
            className="AuctionPage-equalizeButton"
            size="large"
            variant="contained"
            onClick={equalize}
          >
            Equalize
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuctionPage;
