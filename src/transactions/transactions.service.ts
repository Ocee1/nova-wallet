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

  /**
   * Helper function to determine the correct repository/manager context.
   * If a queryRunner is provided, use its manager; otherwise, use the default repository.
   */
  private getManagerOrRepository(queryRunner?: QueryRunner): Repository<Transaction> {
    if (queryRunner) {
      // Use the manager from the ongoing transaction
      return queryRunner.manager.getRepository(Transaction);
    }
    // Use the default repository
    return this.transactionsRepository;
  }

  // --- CREATE CREDIT ---
  async createCredit(
    data: { walletId: string; amount: number },
    queryRunner?: QueryRunner, // Make the QueryRunner optional
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
    queryRunner?: QueryRunner, // Make the QueryRunner optional
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
    // This is a simple read, so we use the default repository
    return this.transactionsRepository.find({
      where: { walletId },
      order: { createdAt: 'DESC' }, // Order by newest first
    });
  }
}