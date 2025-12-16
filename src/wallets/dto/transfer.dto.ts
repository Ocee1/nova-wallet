import { IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class TransferWalletDto {
  @IsUUID()
  fromWalletId: string;
  
  @IsUUID()
  toWalletId: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsNumber()
  @IsOptional()
  balance?: number;

}