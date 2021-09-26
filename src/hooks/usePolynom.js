import useWeb3 from './useWeb3';
import PolynomABI from './polynom.json';

const polynomAddress = '0x78aa2A4DcefF90F91A49DDAB57Cb6B69Dd4943BC';

const usePolynom = () => {
  const { web3 } = useWeb3();

  const checkAddress = async (address) => {
    if (!web3) return false;
    const polynomContract = new web3.eth.Contract(PolynomABI, polynomAddress);
    try {
      const addressExists = await polynomContract.methods
        .boolMap(address)
        .call();
      return addressExists;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return { checkAddress };
};

export default usePolynom;
