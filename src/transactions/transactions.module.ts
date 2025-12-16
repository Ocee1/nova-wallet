import { Module } from '@nestjs/common';
import { Type } from 'class-transformer';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [],
  providers: [
    TransactionsService
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
