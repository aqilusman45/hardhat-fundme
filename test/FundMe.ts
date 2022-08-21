import { expect } from "chai"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { FundMe, MockV3Aggregator } from "../typechain-types"

describe("FundMe", async () => {
    let fundMe: FundMe
    let deployer
    let mockV3Aggregator: MockV3Aggregator
    beforeEach(async () => {
        try {
            // const accounts = await ethers.getSigners()
            // deployer = accounts[0]
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"], {
                keepExistingDeployments: true,
            })
            fundMe = await ethers.getContract("FundMe", deployer)
            mockV3Aggregator = await ethers.getContract(
                "MockV3Aggregator",
                deployer
            )
        } catch (error) {
            console.log(error)
        }
    })

    describe("contructor", async () => {
        it("sets aggregator address correctly", async () => {
            const res = await fundMe.priceFeed()
            expect(res.toString()).equal(mockV3Aggregator.address)
        })
    })
})
