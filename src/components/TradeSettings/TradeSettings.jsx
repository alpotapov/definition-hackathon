import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControl,
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';

import usePolyPool from '../../hooks/usePolyPool';

import './TradeSettings.css';

// eslint-disable-next-line react/prop-types
const TradeSettings = ({ setTokenToSell, tokenToSell }) => {
  const { shareList, getPrice, trade } = usePolyPool();

  const [sellToken, setSellToken] = useState(tokenToSell);
  const onSellTokenChange = (evt) => {
    console.log({ evt });
    setTokenToSell(evt.target.value);
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

  const executeTrade = async () => {
    const numSellTokenValue = Number.parseInt(sellTokenValueDebounced, 10);
    await trade(numSellTokenValue, sellToken, buyToken);
  };

  return (
    <div className="TradeSettings">
      <FormControl fullWidth>
        <TextField
          fullWidth
          id="addressPool"
          variant="outlined"
          value={addressPool}
          onChange={onAddressPoolChange}
          label="Address Pool"
        />
      </FormControl>
      <div className="TradeSettings-columns">
        <div className="TradeSettings-sellColumn">
          <div className="TradeSettings-formItem">
            <FormControl fullWidth>
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
            </FormControl>
          </div>
          <div className="TradeSettings-formItem">
            <TextField
              id="sellTokenValue"
              variant="outlined"
              value={sellTokenValue}
              onChange={onSellTokenValueChange}
              label="Value"
            />
          </div>
        </div>
        <div className="TradeSettings-changeIconColumn">
          <SyncIcon />
        </div>
        <div className="TradeSettings-buyColumn">
          <div className="TradeSettings-formItem">
            <FormControl fullWidth>
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
            </FormControl>
          </div>
          <div className="TradeSettings-formItem">
            <FormControl fullWidth>
              <TextField
                disabled
                id="buyTokenValue"
                variant="outlined"
                value={buyTokenValue}
                label="Value"
              />
            </FormControl>
          </div>
        </div>
      </div>
      <div className="TradeSettings-cta">
        <Button
          className="TradeSettings-ctaButton"
          size="large"
          variant="contained"
          onClick={executeTrade}
        >
          Change
        </Button>
      </div>
    </div>
  );
};

export default TradeSettings;
