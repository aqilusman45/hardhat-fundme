import { expect } from "chai"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { FundMe, MockV3Aggregator } from "../typechain-types"

describe("FundMe", async () => {
    let fundMe: FundMe
    let deployer: string
    let mockV3Aggregator: MockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")

    beforeEach(async () => {
        try {
            // const accounts = await ethers.getSigners()
            // deployer = accounts[0]
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"])
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

    describe("fund", () => {
        // this is an example of how we can expect
        // failed transaction or function invocation
        // this is a use case of waffle.
        it("fails if not enough eth are sent", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })

        it("updates funders records correctly", async () => {
            await fundMe.fund({
                value: sendValue,
            })
            const res = await fundMe.addressToAmountFunded(deployer)
            expect(res).equal(sendValue)
        })
    })

    describe("withdraw", () => {
        beforeEach(async () => {
            await fundMe.fund({
                value: sendValue,
            })
        })

        it("withdraw ETH from single funder", async () => {
            // Arrange
            const startingContractBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            // Act
            const transactionRes = await fundMe.withdraw()
            const transactionReceipt = await transactionRes.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const totalGasCost = gasUsed.mul(effectiveGasPrice)
            // Assert
            const endingContractbBlc = await ethers.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBlc = await ethers.provider.getBalance(deployer)
            expect(endingContractbBlc.toString()).equal(`0`)
            expect(
                startingContractBalance.add(startingDeployerBalance).toString()
            ).equal(endingDeployerBlc.add(totalGasCost).toString())
        })
    })
})
