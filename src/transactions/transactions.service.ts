import { Injectable } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  
  private getManagerOrRepository(queryRunner?: QueryRunner): Repository<Transaction> {
    if (queryRunner) {
      
      return queryRunner.manager.getRepository(Transaction);
    }
   
    return this.transactionsRepository;
  }

  // --- CREATE CREDIT ---
  async createCredit(
    data: { walletId: string; amount: number },
    queryRunner?: QueryRunner, 
  ): Promise<Transaction> {
    
    const manager = this.getManagerOrRepository(queryRunner);

    const creditTransaction = manager.create({
      ...data,
      type: 'credit',
    });

    return manager.save(creditTransaction);
  }

  // --- CREATE DEBIT ---
  async createDebit(
    data: { walletId: string; amount: number },
    queryRunner?: QueryRunner, 
  ): Promise<Transaction> {
    
    const manager = this.getManagerOrRepository(queryRunner);

    const debitTransaction = manager.create({
      ...data,
      type: 'debit',
    });

    return manager.save(debitTransaction);
  }

  // --- GET BY WALLET ---
  async getByWallet(walletId: string): Promise<Transaction[]> {
    
    return this.transactionsRepository.find({
      where: { walletId },
      order: { createdAt: 'DESC' }, 
    });
  }
}