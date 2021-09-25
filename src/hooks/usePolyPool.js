import { useEffect, useState } from 'react';

import useWeb3 from './useWeb3';

import PolyPoolABI from './polypool.json';

const polyPoolAddress = '0x8Bc9C1629f41b7126DC2Af1A734332Cbe8144680';

const usePolyPool = () => {
  const { web3 } = useWeb3();
  // eslint-disable-next-line
  const [shareList, setShareList] = useState([]);

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

  useEffect(() => {
    if (!web3) {
      return;
    }
    fetchShareList();
  }, [web3]);

  return { shareList, getPrice };
};

export default usePolyPool;
