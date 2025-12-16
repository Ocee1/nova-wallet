import { IsIn, IsString } from "class-validator";

export class CreateWalletDto {
  @IsString()
  @IsIn(['USD', 'EUR', 'GBP'])
  currency: string;
}