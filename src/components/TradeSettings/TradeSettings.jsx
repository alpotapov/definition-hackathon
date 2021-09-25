import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';

import usePolyPool from '../../hooks/usePolyPool';

import './TradeSettings.css';

const TradeSettings = () => {
  const { shareList, getPrice } = usePolyPool();

  const [sellToken, setSellToken] = useState('');
  const onSellTokenChange = (evt) => {
    console.log({ evt });
    setSellToken(evt.target.value);
  };
  const [sellTokenValue, setSellTokenValue] = useState(0);
  const [sellTokenValueDebounced] = useDebounce(sellTokenValue, 1000);
  const onSellTokenValueChange = (evt) => {
    setSellTokenValue(evt.target.value);
  };
  const [buyToken, setBuyToken] = useState('');
  const [buyTokenValue, setBuyTokenValue] = useState(0);

  const onBuyTokenChange = (evt) => {
    setBuyToken(evt.target.value);
  };
  const [addressPool, setAddressPool] = useState('0xAddressPool');
  const onAddressPoolChange = (evt) => {
    setAddressPool(evt.target.value);
  };

  useEffect(() => {
    if (!sellToken || !sellTokenValueDebounced || !buyToken) return;

    getPrice(sellTokenValueDebounced, sellToken, buyToken).then((price) =>
      setBuyTokenValue(price)
    );
  }, [sellTokenValueDebounced, sellToken, buyToken]);

  return (
    <div className="TradeSettings">
      <div>
        <InputLabel id="addressPool">Address Pool</InputLabel>
        <TextField
          fullWidth
          id="addressPool"
          variant="outlined"
          value={addressPool}
          onChange={onAddressPoolChange}
        />
      </div>
      <div className="TradeSettings-columns">
        <div className="TradeSettings-sellColumn">
          <InputLabel id="sellTokenSelectLabel">Sell</InputLabel>
          <Select
            labelId="sellTokenSelectLabel"
            id="sellTokenSelect"
            value={sellToken}
            label="Sell"
            onChange={onSellTokenChange}
          >
            {shareList.map((share) => (
              <MenuItem key={share} value={share}>
                {share}
              </MenuItem>
            ))}
            <MenuItem value="" disabled>
              0xERC20IN
            </MenuItem>
          </Select>
          <InputLabel id="sellTokenValue">Value</InputLabel>
          <TextField
            id="sellTokenValue"
            variant="outlined"
            value={sellTokenValue}
            onChange={onSellTokenValueChange}
          />
        </div>
        <div className="TradeSettings-changeIconColumn">
          <SyncIcon />
        </div>
        <div className="TradeSettings-buyColumn">
          <InputLabel id="buyTokenSelectLabel">Buy</InputLabel>
          <Select
            labelId="buyTokenSelectLabel"
            id="buyTokenSelect"
            value={buyToken}
            label="Buy"
            onChange={onBuyTokenChange}
          >
            {shareList.map((share) => (
              <MenuItem key={share} value={share}>
                {share}
              </MenuItem>
            ))}
            <MenuItem value="" disabled>
              0xERC20OUT
            </MenuItem>
          </Select>
          <InputLabel id="buyTokenValue">Value</InputLabel>
          <TextField
            disabled
            id="buyTokenValue"
            variant="outlined"
            value={buyTokenValue}
          />
        </div>
      </div>
      <div className="TradeSettings-prices">
        <div>Market price: 0.0033 BTC</div>
        <div>Pool price: 0.00021 BTC</div>
      </div>
      <div className="TradeSettings-cta">
        <Button
          className="TradeSettings-ctaButton"
          size="large"
          variant="contained"
        >
          Change
        </Button>
      </div>
    </div>
  );
};

export default TradeSettings;
