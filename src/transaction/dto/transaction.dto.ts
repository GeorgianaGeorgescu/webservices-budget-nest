import { Type } from "class-transformer";
import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, Max, MaxDate, Min } from "class-validator";

export class TransactionDto {
    amount: number;
    date: Date;
    user: {
        id: number;
        name: string;
    };
    place: {
        id: number;
        name: string;
    };
}

export class UpdateTransactionRequest {

    @IsNumber()
    @IsInt()
    @IsPositive()
    placeId: number;
  
    @IsNumber()
    @Min(1)
    amount: number;
  
    @IsDate()
    @IsNotEmpty()
    @MaxDate(() => new Date())
    @Type(() => Date)
    date: Date;
}

export type CreateTransactionRequest = UpdateTransactionRequest;
export type GetAllTransactionsResponse = TransactionDto[];