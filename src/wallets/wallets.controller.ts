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
   * Adds funds to a wallet. Use 200 OK or 204 No Content for successful mutation.
   */
  @Post(':walletId/fund')
  @HttpCode(HttpStatus.OK) // Explicitly set to 200 OK for a successful mutation
  async fundWallet(@Param('walletId') walletId: string, @Body() dto: FundWalletDto): Promise<Wallet> {
    // Assuming fundWallet service method returns the updated wallet object
    return this.walletsService.fundWallet(walletId, dto.amount);
  }

  /**
   * Endpoint: POST /wallets/transfer
   * Transfers funds between two wallets. Use 200 OK for successful transaction.
   */
  @Post('transfer')
  @HttpCode(HttpStatus.OK) // Explicitly set to 200 OK for a completed transaction
  async transfer(@Body() dto: TransferWalletDto): Promise<Response> {
    // Assuming transfer service method returns { success: true }
    return this.walletsService.transfer(dto);
  }

  /**
   * Endpoint: GET /wallets/:walletId
   * Retrieves wallet details and transaction history.
   */
  @Get(':walletId')
  async getWallet(@Param('walletId') walletId: string) {
    // Return type can be a DTO or the structured object { wallet, transactions }
    return this.walletsService.getWalletDetails(walletId);
  }

  @Get()
  async getWallets(): Promise<Response> {
    return this.walletsService.getAllWallets();
  }
}