import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  walletId: string;

  @Column()
  type: 'credit' | 'debit' | 'transfer';

  @Column({ type: 'numeric', precision: 18 })
  amount: number;

  @Column({ nullable: true })
  referenceId: string;

  @CreateDateColumn()
  createdAt: Date;
}