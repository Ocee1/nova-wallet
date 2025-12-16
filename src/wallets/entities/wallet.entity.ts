import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 'USD' })
    currency: string;

    @Column({ type: 'numeric', precision: 18, scale: 2, default: '0' })
    balance: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}