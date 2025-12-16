import { Controller, Post, Get, Param, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferWalletDto } from './dto/transfer.dto';
import { Wallet } from './entities/wallet.entity';
import { Response } from '../interceptors/transform.interceptor';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  /**
   * Endpoint: POST /wallets
   * Creates a new wallet. Returns 201 Created.
   */
  @Post()
  async createWallet(@Body() dto: CreateWalletDto): Promise<Wallet> {
    return this.walletsService.createWallet(dto);
  }

  /**
   * Endpoint: POST /wallets/:walletId/fund
   * Adds funds to a wallet.
   */
  @Post(':walletId/fund')
  @HttpCode(HttpStatus.OK) 
  async fundWallet(@Param('walletId') walletId: string, @Body() dto: FundWalletDto): Promise<Wallet> {
 
    return this.walletsService.fundWallet(walletId, dto.amount);
  }

  /**
   * Endpoint: POST /wallets/transfer
   * Transfers funds between two wallets. 
   */
  @Post('transfer')
  @HttpCode(HttpStatus.OK) 
  async transfer(@Body() dto: TransferWalletDto): Promise<Response> {
    return this.walletsService.transfer(dto);
  }

  /**
   * Endpoint: GET /wallets/:walletId
   * Retrieves wallet details and transaction history.
   */
  @Get(':walletId')
  async getWallet(@Param('walletId') walletId: string) {
    return this.walletsService.getWalletDetails(walletId);
  }

  @Get()
  async getWallets(): Promise<Response> {
    return this.walletsService.getAllWallets();
  }
}