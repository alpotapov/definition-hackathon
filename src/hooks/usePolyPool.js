import { useEffect, useState } from 'react';

import useWeb3 from './useWeb3';

import PolyPoolABI from './polypool.json';

const polyPoolAddress = '0x25A199D32c2EA48730e392ad22AB307D75bF8FF0';

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

  useEffect(() => {
    if (!web3) {
      return;
    }
    fetchShareList();
  }, [web3]);

  return { shareList };
};

export default usePolyPool;
