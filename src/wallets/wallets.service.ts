import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { TransferWalletDto } from './dto/transfer.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Decimal } from 'decimal.js';
import { Response } from '../interceptors/transform.interceptor';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,

    private dataSource: DataSource,
    private readonly transactionsService: TransactionsService,
  ) {}

  async createWallet(dto: CreateWalletDto) {
    const newWallet = this.walletsRepository.create({
      // id: crypto.randomUUID(),
      currency: dto.currency,
      balance: '0',
    });

    const savedWallet = await this.walletsRepository.save(newWallet);
    return savedWallet;
  }

  async fundWallet(walletId: string, amount: number) {
    const queryRunner = this.dataSource.createQueryRunner(); 

    await queryRunner.connect();
    await queryRunner.startTransaction(); 

    try {
      const wallet = await queryRunner.manager.findOneOrFail(Wallet, {
        where: { id: walletId },
      });

      await this.transactionsService.createCredit({
        walletId,
        amount,
      });

      const currentBalance = new Decimal(wallet.balance);
      const fundingAmount = new Decimal(amount);


      console.log('Current Balance:', wallet, 'Funding Amount:', amount, typeof wallet.balance, typeof amount);
      wallet.balance = currentBalance.plus(fundingAmount).toFixed(2);

      await queryRunner.manager.save(wallet);

      await queryRunner.commitTransaction();

      return wallet; 
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('Funding failed, rolling back:', err);
      throw new InternalServerErrorException(
        'Failed to fund wallet due to a transaction error.',
      );
    } finally {
    
      await queryRunner.release();
    }
  }

  async transfer(dto: TransferWalletDto): Promise<Response> {
    const { fromWalletId, toWalletId, amount } = dto;

    if (fromWalletId === toWalletId) {
      throw new ConflictException('Cannot transfer money to the same wallet.');
    }

    if (amount <= 0) {
      throw new BadRequestException('Transfer amount must be positive.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); 

    try {

      const sender = await queryRunner.manager.findOneOrFail(Wallet, {
        where: { id: fromWalletId },
        
      });

      const receiver = await queryRunner.manager.findOneOrFail(Wallet, {
        where: { id: toWalletId },
      });


      if (new Decimal(sender.balance).lessThan(amount)) {
        throw new ConflictException(
          'Insufficient balance in the sender wallet.',
        );
      }

      await this.transactionsService.createDebit(
        {
          walletId: sender.id,
          amount: amount,
        },
        queryRunner,
      );

      await this.transactionsService.createCredit(
        {
          walletId: receiver.id,
          amount: amount,
        },
        queryRunner,
      );

      // Update balances
      sender.balance = new Decimal(sender.balance).plus(amount).toFixed(2);
      receiver.balance = new Decimal(receiver.balance).plus(amount).toFixed(2);

      await queryRunner.manager.save(sender);
      await queryRunner.manager.save(receiver);

      await queryRunner.commitTransaction();

      return { message: 'Transfer processed successfully' };
    } catch (error) {
      // rollback if any error occurs
      await queryRunner.rollbackTransaction();

      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.log('Transfer failed, rolling back:', error);
      throw new InternalServerErrorException(
        'Transfer failed due to a system error.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getWalletDetails(walletId: string) {
    const wallet = await this.findWallet(walletId);
    const transactions = await this.transactionsService.getByWallet(walletId);

    return { wallet, transactions };
  }

  private async findWallet(walletId: string) {
    
    const wallet = await this.walletsRepository
      .findOneOrFail({
        where: { id: walletId },
      })
      .catch(() => {
        throw new NotFoundException('Wallet not found');
      });

    return wallet;
  }

  async getAllWallets(): Promise<Response> {
    let wallets = await this.walletsRepository.find();
    return { message: 'Wallets retrieved successfully', data:wallets };
  }
}
