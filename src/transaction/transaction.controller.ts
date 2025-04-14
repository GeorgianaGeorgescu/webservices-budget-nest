import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/core/decorators/currentUser.decorator';
import { CreateTransactionRequest, GetAllTransactionsResponse, TransactionDto, UpdateTransactionRequest } from './dto/transaction.dto';
import { UserSession } from 'src/user/dto/user.dto';

@UseGuards(AuthGuard)
@Controller('transactions')
export class TransactionController {
    constructor(private transactionService: TransactionService) {}

    @Get('')
    async getAllTransactions(@CurrentUser() user: UserSession): Promise<GetAllTransactionsResponse>{
        return await this.transactionService.getAll(user.id,user.roles);
    }

    @Post('')
    async createTransaction(
        @CurrentUser() user: UserSession, 
        @Body() createTransactionDto : CreateTransactionRequest
    ): Promise<TransactionDto>
    {
        return await this.transactionService.create(user.id, createTransactionDto);
    }

    @Get(':id')
    async getTransactionById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: UserSession
    ): Promise<TransactionDto>{
        return await this.transactionService.getById(id,user.id,user.roles);
    }

    @Put(':id')
    async updateTransaction(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: UserSession, 
        @Body() updateTransactionDto : UpdateTransactionRequest
    ): Promise<TransactionDto>
    {
        return await this.transactionService.updateById(id,user.id,updateTransactionDto);
    }
    
    @Delete(':id')
    async deleteTransaction(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: UserSession
    ): Promise<void>{
        return await this.transactionService.deleteById(id,user.id);
    }

}
 