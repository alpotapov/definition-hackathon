// eslint-disable-next-line no-unused-vars
import { useEffect, useRef, useState } from 'react';

import Web3 from 'web3';

// import ABI from './abi.json';
// import PolynomABI from './polynom.json';

const useWeb3 = () => {
  const [web3, setWeb3] = useState();
  // eslint-disable-next-line
  const [state, setState] = useState(false);

  const onWeb3Init = async () => {
    await window.ethereum.enable();
    console.log('enabled');
  };

  useEffect(() => {
    const newWeb3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
    setWeb3(newWeb3);
    setState(true);
    onWeb3Init();
  }, []);

  return { web3 };
};

export default useWeb3;

// const useWeb3ContractValidation = () => {
//   const web3 = useRef(null);
//   // const [contract, setContract] = useState(null);

//   const onWeb3Init = async () => {
//     const network = await web3.current.eth.net.getNetworkType();
//     await window.ethereum.enable();
//     const accounts = await web3.current.eth.getAccounts();
//     console.log({ network, accounts });

//     const polyPoolAddress = '0x25A199D32c2EA48730e392ad22AB307D75bF8FF0';
//     const newContract = new web3.current.eth.Contract(ABI, polyPoolAddress);
//     console.log({ newContract });
//     const supply = await newContract.methods.totalSupply().call();
//     console.log({ supply });

//     const polynomAddress = '0xe795dCb93601fbe8418ca44F0F1208b19c0419e6';
//     const polynomContract = new web3.current.eth.Contract(
//       PolynomABI,
//       polynomAddress
//     );
//     const exists = await polynomContract.methods.boolMap(polynomAddress).call();
//     console.log({ exists });
//   };

//   useEffect(() => {
//     web3.current = new Web3(Web3.givenProvider || 'ws://localhost:8545');
//     onWeb3Init();
//   }, []);

//   return { web3: web3.current };
// };

// export default useWeb3ContractValidation;
