import { useEffect, useState } from 'react';

import useWeb3 from './useWeb3';
import PolynomABI from './polynom.json';

// const polyPoolAddress = '0x25A199D32c2EA48730e392ad22AB307D75bF8FF0';
const polynomAddress = '0xe795dCb93601fbe8418ca44F0F1208b19c0419e6';

const usePoolList = () => {
  const { web3 } = useWeb3();
  // eslint-disable-next-line
  const [poolList, setPoolList] = useState([]);

  const fetchPoolList = async () => {
    console.log({ web3 });
    const polynomContract = new web3.eth.Contract(PolynomABI, polynomAddress);
    const mapIter = await polynomContract.methods.mapIter().call();
    console.log({ mapIter });

    // const exists = await polynomContract.methods
    //   .addressMap(polyPoolAddress)
    //   .call();
    // console.log({ exists });
  };

  useEffect(() => {
    if (!web3) {
      console.log('undef');
      return;
    }
    console.log({ a: 'def', web3 });
    fetchPoolList();
  }, [web3]);

  return { poolList };
};

export default usePoolList;
