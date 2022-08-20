import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { networkConfig } from "../config"

export default async ({
    deployments,
    getNamedAccounts,
}: HardhatRuntimeEnvironment) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config?.chainId || 4

    let priceFeedAddress;
    if (chainId === 31337) {
        const priceFeedAggregator = await deployments.get("MockV3Aggregator");
        priceFeedAddress = priceFeedAggregator.address;
    } else {
        const { ethUsdPriceFeed } = networkConfig[chainId]
        priceFeedAddress = ethUsdPriceFeed;
    }
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [priceFeedAddress], // constructor arguments, priceFeedAddress for FundMe contract
        log: true,
    })
}

export const tags = ["all", "fundme"]