import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DECIMALS, developmentChains, INITIAL_ANSWER } from "../config"

export default async ({
    deployments,
    getNamedAccounts,
}: HardhatRuntimeEnvironment) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainName = network.name

    if (developmentChains.includes(chainName)) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        console.log("Mocks Deployed")
    }
}

export const tags = ["all", "mocks"]
