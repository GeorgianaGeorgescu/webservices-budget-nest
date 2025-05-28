import {MaxDate} from "class-validator";
import {
    IsNumber,
    IsDate,
    IsNested,
  } from 'nestjs-swagger-dto';
import { PlaceSummaryDto } from "../../place/dto/place.dto";
import { PublicUserDto } from "../../user/dto/user.dto";

export class TransactionDto {
    
    @IsNumber({ name:'amount',min:1})
    amount: number;

    @IsDate({format: 'date-time', name:'date'})
    @MaxDate(() => new Date())
    date: Date;

    @IsNested({ name: 'user', type: PublicUserDto})
    user: Pick<PublicUserDto, 'id' | 'name'>;  

    @IsNested({ name: 'place', type: PlaceSummaryDto})
    place: PlaceSummaryDto
}

export class UpdateTransactionRequest {

    @IsNumber({ name:'placeId', min:1})
    placeId: number;
  
    @IsNumber({ name:'amount'})
    amount: number;
  
    @IsDate({format: 'date-time', name:'date'})
    @MaxDate(() => new Date())
    date: Date;
}
export class CreateTransactionRequest extends UpdateTransactionRequest {}
export type GetAllTransactionsResponse = TransactionDto[];