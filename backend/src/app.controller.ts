import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { PurchaseTokensDto } from './dtos/purchaseTokens.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('get-randomNumber')
  getRandomNumber(): any {
    return this.appService.getRandomNumber();
  }

  @Get('openBets')
  openBets(@Query('closingTime') closingTime: number): Promise<any> {
    return this.appService.openBets(closingTime);
  }

  @Post('purchaseTokens')
  purchaseTokens(@Body() token: PurchaseTokensDto): Promise<any> {
    return this.appService.purchaseTokens(token.amount);
  }

  @Get('bet')
  bet(): Promise<any> {
    return this.appService.bet();
  }

  @Get('betMany')
  betMany(@Query('times') times: number): Promise<any> {
    return this.appService.betMany(times);
  }

  @Get('closeLottery')
  closeLottery(): Promise<any> {
    return this.appService.closeLottery();
  }

  @Get('prizeWithdraw')
  prizeWithdraw(@Query('amount') amount: number): Promise<any> {
    return this.appService.prizeWithdraw(amount);
  }

  @Get('ownerWithdraw')
  ownerWithdraw(@Query('amount') amount: number): Promise<any> {
    return this.appService.ownerWithdraw(amount);
  }

  @Get('returnTokens')
  returnTokens(@Query('amount') amount: number): Promise<any> {
    return this.appService.returnTokens(amount);
  }

}