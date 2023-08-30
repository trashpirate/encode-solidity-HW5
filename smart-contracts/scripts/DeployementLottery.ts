import { ethers } from "ethers";
import { LotteryToken__factory, Lottery__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const proposals = process.argv.slice(2);
  console.log("Deploying Lottery contract");

const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

console.log(`Using address ${wallet.address}`);
const balanceBN = await provider.getBalance(wallet.address);
const balance = Number(ethers.formatUnits(balanceBN));
console.log(`Wallet balance ${balance}`);
if (balance < 0.01) {
  throw new Error("Not enough ether");
}

const ballotFactory = new Lottery__factory(wallet);
const ballotContract = await ballotFactory.deploy("LottoBall", "LTB", 1n, ethers.parseUnits("1"), ethers.parseUnits("0.2"));
await ballotContract.waitForDeployment();

const address = await ballotContract.getAddress();
console.log(`Contract deployed at address ${address}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});