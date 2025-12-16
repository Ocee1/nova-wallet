import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    TypeOrmModule,
    TransactionsModule,
  ], 
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}