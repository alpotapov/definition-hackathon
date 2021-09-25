import React, { useEffect, useState } from 'react';
import { InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';

// import usePoolList from '../../hooks/usePoolList';
import useShareList from '../../hooks/useShareList';

import './TradeSettings.css';

const TradeSettings = () => {
  // eslint-disable-next-line
  // const { poolList } = usePoolList();
  // eslint-disable-next-line
  const { shareList } = useShareList();

  useEffect(() => {
    console.log({ shareList });
  }, [shareList]);

  const [sellToken, setSellToken] = useState('0xERC20IN');
  const onSellTokenChange = (evt) => {
    console.log({ evt });
    setSellToken(evt.target.value);
  };
  const [sellTokenValue, setSellTokenValue] = useState(0);
  const onSellTokenValueChange = (evt) => {
    setSellTokenValue(evt.target.value);
  };
  const [buyToken, setBuyToken] = useState('0xERC20OUT');
  const [buyTokenValue, setBuyTokenValue] = useState(0);
  const onBuyTokenValueChange = (evt) => {
    setBuyTokenValue(evt.target.value);
  };
  const onBuyTokenChange = (evt) => {
    setBuyToken(evt.target.value);
  };
  const [addressPool, setAddressPool] = useState('0xAddressPool');
  const onAddressPoolChange = (evt) => {
    setAddressPool(evt.target.value);
  };
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
            <MenuItem value="0xERC20IN">0xERC20IN</MenuItem>
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
            <MenuItem value="0xERC20OUT">0xERC20OUT</MenuItem>
          </Select>
          <InputLabel id="buyTokenValue">Value</InputLabel>
          <TextField
            id="buyTokenValue"
            variant="outlined"
            value={buyTokenValue}
            onChange={onBuyTokenValueChange}
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
