import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../core/decorators/currentUser.decorator';
import { CreateTransactionRequest, GetAllTransactionsResponse, TransactionDto, UpdateTransactionRequest } from './dto/transaction.dto';
import { UserSession } from '../user/dto/user.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('transactions')
export class TransactionController {
    constructor(private transactionService: TransactionService) {}

    @ApiResponse({
        status: 200,
        description: 'Get all transactions',
        type: TransactionDto,
    })
    @Get('')
    async getAllTransactions(@CurrentUser() user: UserSession): Promise<GetAllTransactionsResponse>{
        return await this.transactionService.getAll(user.id,user.roles);
    }

    @ApiResponse({
        status: 201,
        description: 'Create transaction',
        type: TransactionDto,
    })
    @Post('')
    async createTransaction(
        @CurrentUser() user: UserSession, 
        @Body() createTransactionDto : CreateTransactionRequest
    ): Promise<TransactionDto>{
        return await this.transactionService.create(user.id, createTransactionDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get transaction by Id',
        type: TransactionDto,
    })
    @Get(':id')
    async getTransactionById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: UserSession
    ): Promise<TransactionDto>{
        return await this.transactionService.getById(id,user.id,user.roles);
    }

    @ApiResponse({
        status: 200,
        description: 'Update transaction',
        type: TransactionDto,
    })
    @Put(':id')
    async updateTransaction(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: UserSession, 
        @Body() updateTransactionDto : UpdateTransactionRequest
    ): Promise<TransactionDto>{
        return await this.transactionService.updateById(id,user.id,updateTransactionDto);
    }
    
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTransaction(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: UserSession
    ): Promise<void>{
        return await this.transactionService.deleteById(id,user.id);
    }

}
 