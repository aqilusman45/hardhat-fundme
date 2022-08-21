import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { networkConfig, developmentChains } from "../config"
import { verify } from "../utils/verify"

export default async ({
    deployments,
    getNamedAccounts,
}: HardhatRuntimeEnvironment) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config?.chainId || 4

    let priceFeedAddress
    if (chainId === 31337) {
        const priceFeedAggregator = await deployments.get("MockV3Aggregator")
        priceFeedAddress = priceFeedAggregator.address
    } else {
        const { ethUsdPriceFeed } = networkConfig[chainId]
        priceFeedAddress = ethUsdPriceFeed
    }
    const args = [priceFeedAddress] // constructor arguments, priceFeedAddress for FundMe contract
    log('Deploying Fundme ---------------------')
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: (network.config as any)?.blockConfirmation || 1,
    })
    log('Fundme Deployed ---------------------')
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
}

export const tags = ["all", "fundme"]
