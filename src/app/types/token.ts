import { Address } from 'thirdweb';

type Token = {
  address: Address,
  symbol: string,
  decimals: number,
  image: string,
  chainId?: number
}

export default Token;