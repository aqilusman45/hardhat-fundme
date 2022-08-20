type NetworkConfig = {
    [key: number]: {
        name: string
        ethUsdPriceFeed?: string
    }
}

export const networkConfig: NetworkConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
    31337: {
        name: "localhost",
    },
}

export const developmentChains = ["hardhat", "localhost"]


export const DECIMALS = 8;
export const INITIAL_ANSWER = 200000000000;
