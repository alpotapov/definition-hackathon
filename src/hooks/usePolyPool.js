import { useEffect, useState } from 'react';

import useWeb3 from './useWeb3';

import PolyPoolABI from './polypool.json';

export const polyPoolAddress = '0x8Bc9C1629f41b7126DC2Af1A734332Cbe8144680';

const usePolyPool = () => {
  const { web3 } = useWeb3();
  const [shareList, setShareList] = useState([]);
  const [isTrader, setIsTrader] = useState(false);
  const [maxBid, setMaxBid] = useState(0);
  const [yourCurrentBid, setYourCurrentBid] = useState(0);

  const fetchShareList = async () => {
    const polyPoolContract = new web3.eth.Contract(
      PolyPoolABI,
      polyPoolAddress
    );
    const shareIter = Number.parseInt(
      await polyPoolContract.methods.shareIter().call(),
      10
    );
    const shares = [];
    // eslint-disable-next-line
    for (let i = 0; i < shareIter; i++) {
      // eslint-disable-next-line
      const share = await polyPoolContract.methods.shareAddress(i).call();
      console.log({ share });
      shares.push(share);
    }
    setShareList(shares);
  };

  const getPrice = async (value, addressIn, addressOut) => {
    const polyPoolContract = new web3.eth.Contract(
      PolyPoolABI,
      polyPoolAddress
    );

    const price = await polyPoolContract.methods
      .getPrice(value, addressIn, addressOut)
      .call();

    return price;
  };

  const fetchMaxBid = async () => {
    const polyPoolContract = new web3.eth.Contract(
      PolyPoolABI,
      polyPoolAddress
    );

    const bid = await polyPoolContract.methods.maxBid().call();
    console.log({ maxBid: bid });

    setMaxBid(bid);
  };

  const fetchYourCurrentBid = async () => {
    const polyPoolContract = new web3.eth.Contract(
      PolyPoolABI,
      polyPoolAddress
    );

    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 1) {
      console.log('MORE THAN ONE ACCOUNT. Using the first');
    }

    const bid = await polyPoolContract.methods.bids(accounts[0]).call();
    console.log({ yourBid: bid });

    setYourCurrentBid(bid);
  };

  const checkIsTrader = async () => {
    const polyPoolContract = new web3.eth.Contract(
      PolyPoolABI,
      polyPoolAddress
    );
    const accounts = await web3.eth.getAccounts();
    const trader = await polyPoolContract.methods.trader().call();

    setIsTrader(accounts.includes(trader));
  };

  const doBid = async (value) => {
    const polyPoolContract = new web3.eth.Contract(
      PolyPoolABI,
      polyPoolAddress
    );

    const accounts = await web3.eth.getAccounts();
    const selectedAccount = accounts[0];

    console.log({ value, selectedAccount });
    const result = await polyPoolContract.methods
      .doBid(value)
      .send({ from: selectedAccount });

    return result;
  };

  const approve = async (value) => {
    const polyPoolContract = new web3.eth.Contract(
      PolyPoolABI,
      polyPoolAddress
    );

    const accounts = await web3.eth.getAccounts();
    const selectedAccount = accounts[0];

    console.log({ value });

    const result = await polyPoolContract.methods
      .approve(polyPoolAddress, value)
      .send({ from: selectedAccount });

    return result;
  };

  useEffect(() => {
    if (!web3) {
      return;
    }
    fetchShareList();
    checkIsTrader();
    fetchMaxBid();
    fetchYourCurrentBid();
  }, [web3]);

  return {
    shareList,
    getPrice,
    isTrader,
    maxBid,
    yourCurrentBid,
    doBid,
    approve,
  };
};

export default usePolyPool;
