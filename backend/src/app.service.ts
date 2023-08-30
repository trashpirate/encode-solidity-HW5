import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/Lottery.json';

//const TOKEN_ADDRESS = "0xfAaD0F47622B45be7139413B53F8cE1475cACfD3";
const TOKEN_ADDRESS = "0x11208f28FD3b2b2F2FFcC5c093ae4a87d6001aCD";


@Injectable()
export class AppService {
  provider: ethers.Provider;
  wallet: ethers.Wallet;
  contract: ethers.Contract;

  constructor(){
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? '',);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', this.provider)
    this.contract = new ethers.Contract(TOKEN_ADDRESS, tokenJson.abi, this.wallet);
  }

  getHello(): string {
    return 'Hello World!';
  }

  getRandomNumber(): Promise<any> {
    return this.contract.getRandomNumber();
  }

  openBets(closingTime: number): Promise<any> {
    return this.contract.openBets(closingTime);
  }

  purchaseTokens(): Promise<any> {
    return this.contract.purchaseTokens();
  }

  bet(): Promise<any> {
    return this.contract.bet();
  }
  
  betMany(times: number): Promise<any> {
    return this.contract.betMany(times);
  }

  closeLottery(): Promise<any> {
    return this.contract.closeLottery();
  }
  
  prizeWithdraw(amount: number): Promise<any> {
    return this.contract.prizeWithdraw(amount);
  }

  ownerWithdraw(amount: number): Promise<any> {
    return this.contract.ownerWithdraw(amount);
  }

  returnTokens(amount: number): Promise<any> {
    return this.contract.returnTokens(amount);
  }

  
  
/*
  getHello(): string {
    return 'Hello World!';
  }

  getAnotherThing(): string {
    return "Other Thing";
  }

  getTokenAddress(): any {
    return {address: TOKEN_ADDRESS};
  }

  getTotalSupply(): Promise<bigint> {
    return this.contract.totalSupply();
  }

  getTokenBalance(address: string): Promise<bigint> {
    return this.contract.balanceOf(address);
  }

  async mintTokens(address: string): Promise<any> {
    const tx = await this.contract.mind(address, ethers.parseUnits("1"))
    const receipt = await tx.wait();
    return {success: true, txHash: receipt.tx}
    //return {success: true, txHash: '...'}
  }
*/
}
