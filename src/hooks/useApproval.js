import useWeb3 from './useWeb3';

import { polyPoolAddress } from './usePolyPool';

import ERC20ABI from './erc20abi.json';

const useApproval = (tokenAddress) => {
  const { web3 } = useWeb3();

  const approve = async (value) => {
    const ERC20Contract = new web3.eth.Contract(ERC20ABI, tokenAddress);

    const accounts = await web3.eth.getAccounts();
    const selectedAccount = accounts[0];

    console.log({ value });

    const result = await ERC20Contract.methods
      .approve(polyPoolAddress, value)
      .send({ from: selectedAccount });

    return result;
  };

  return { approve };
};

export default useApproval;
