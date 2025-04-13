import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/data/prisma.service';
import { CreateTransactionRequest, TransactionDto, UpdateTransactionRequest } from './dto/transaction.dto';
import Role from '../core/roles'
import { handleDBError } from 'src/core/handleDBError';
import { PlaceService } from 'src/place/place.service';

@Injectable()
export class TransactionService {
    constructor(
        private prisma: PrismaService,
        private placeService: PlaceService
    ) {}
    
    private readonly TRANSACTION_SELECT = {
        id: true,
        amount: true,
        date: true,
        place: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
    };

    async getAll(userId: number, roles: string[]):Promise<TransactionDto[]>{
        return this.prisma.transaction.findMany({
            where:  roles.includes(Role.ADMIN) ? {} : { user_id: userId },
            select: this.TRANSACTION_SELECT,
        });
    }
    
    async getById(id: number, userId: number,roles: string[]): Promise<TransactionDto> {
        const extraFilter = roles.includes(Role.ADMIN) ? {} : { user_id: userId };
        const transaction = await this.prisma.transaction.findUnique({
            where: {
              id,
              ...extraFilter,
            },
            select: this.TRANSACTION_SELECT,
        });      
        if (!transaction) {
            throw new NotFoundException(`No transaction with this id exists`);
        }
        return transaction;
    }

    async create(
        userId: number,
        { amount,
            date,
            placeId,
        } : CreateTransactionRequest      
    ): Promise<TransactionDto> {
        try {
            await this.placeService.checkPlaceExists(placeId);
        
            return await this.prisma.transaction.create({
              data: {
                amount,
                date,
                user_id: userId,
                place_id: placeId,
              },
              select: this.TRANSACTION_SELECT,
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw handleDBError(error);
        }
    }

    async updateById(
        id: number, 
        userId: number,
        { amount,
            date,
            placeId,
        } : UpdateTransactionRequest      
    ): Promise<TransactionDto> {
        try {
            await this.placeService.checkPlaceExists(placeId);
            
            return await this.prisma.transaction.update({
              where: {
                id,
                user_id: userId,
            },
              data: {
                amount,
                date,
                place_id: placeId,
            },
              select: this.TRANSACTION_SELECT,
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw handleDBError(error);
        }
    }

    async deleteById(id: number, userId: number): Promise<void> {
        try {
            await this.prisma.transaction.delete({
              where: {
                id,
                user_id: userId,
              },
            });
        } catch (error) {
            throw handleDBError(error);
        }
    }

    async getTransactionsByPlaceId(placeId: number, userId: number): Promise<TransactionDto[]> {
        return this.prisma.transaction.findMany({
            where: {
              place_id: placeId,
              user_id: userId,
            },
            select: this.TRANSACTION_SELECT,
        });
    }

}
