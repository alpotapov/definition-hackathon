// import { useEffect, useState } from 'react';

import useWeb3 from './useWeb3';

import PolyPoolABI from './polypool.json';

import { polyPoolAddress } from './usePolyPool';

const simpleErc20Address = '0x6cBaD225770fc955B13FA1f8D674Eed74FBD3d69';

const usePolyPool = () => {
  const { web3 } = useWeb3();

  const approve = async (value) => {
    const polyPoolContract = new web3.eth.Contract(
      PolyPoolABI,
      simpleErc20Address
    );

    const accounts = await web3.eth.getAccounts();
    const selectedAccount = accounts[0];

    console.log({ value });

    const result = await polyPoolContract.methods
      .approve(polyPoolAddress, value)
      .send({ from: selectedAccount });

    return result;
  };

  // useEffect(() => {
  //   if (!web3) {
  //     return;
  //   }
  // }, [web3]);

  return {
    approve,
  };
};

export default usePolyPool;
