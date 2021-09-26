// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import { Button, InputLabel, TextField } from '@mui/material';

import { useDebounce } from 'use-debounce';
import usePolynom from '../../hooks/usePolynom';

import './AuctionPage.css';

const AuctionPage = () => {
  const { checkAddress } = usePolynom();
  const [addressPool, setAddressPool] = useState('');
  const [addressPoolDebounced] = useDebounce(addressPool, 1000);
  const [isValidAddress, setIsValidAddress] = useState(true);
  const onAddressPoolChange = (evt) => {
    console.log({ evt: evt.target.value });
    setAddressPool(evt.target.value);
  };
  useEffect(() => {
    const runCheckAddress = async () => {
      const addressExists = await checkAddress(addressPoolDebounced);
      console.log({ exists: addressExists });
      setIsValidAddress(addressExists);
    };
    console.log({ here: addressPoolDebounced });
    runCheckAddress();
  }, [addressPoolDebounced]);
  // eslint-disable-next-line no-unused-vars
  const [maxBid, setMaxBid] = useState(0);
  const [yourBid, setYourBid] = useState(0);
  const onYourBidChange = (evt) => {
    setYourBid(evt.target.value);
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
              error={!isValidAddress}
              id="addressPool"
              variant="outlined"
              value={addressPool}
              onChange={onAddressPoolChange}
            />
            <InputLabel id="maxBid">Max Bid</InputLabel>
            <TextField
              fullWidth
              id="maxBid"
              variant="outlined"
              value={maxBid}
            />
            <InputLabel id="yourBid">Your Bid</InputLabel>
            <TextField
              fullWidth
              id="yourBid"
              variant="outlined"
              value={yourBid}
              onChange={onYourBidChange}
            />
          </div>
        </div>
        <div className="AuctionPage-rightColumn">
          <p>Equalize</p>
          <Button
            className="TradeSettings-ctaButton"
            size="large"
            variant="contained"
          >
            Equalize
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuctionPage;
