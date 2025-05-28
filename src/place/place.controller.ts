import { Body, Controller, Delete, forwardRef, Get, HttpCode, HttpStatus, Inject, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { PlaceService } from './place.service';
import { CreatePlaceRequest, GetAllPlacesResponse, PlaceDto, UpdatePlaceRequest } from './dto/place.dto';
import { CurrentUser } from '../core/decorators/currentUser.decorator';
import { UserSession } from '../user/dto/user.dto';
import { GetAllTransactionsResponse, TransactionDto } from '../transaction/dto/transaction.dto';
import { TransactionService } from '../transaction/transaction.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('places')
export class PlaceController {
    constructor(
        private placeService: PlaceService,
        @Inject(forwardRef(() => TransactionService))      
        private transactionService: TransactionService
    ) {}

    @ApiResponse({
        status: 200,
        description: 'Get all places',
        type: [PlaceDto],
    })
    @Get('')
    async getAllPlaces(): Promise<GetAllPlacesResponse>{
        return await this.placeService.getAll();
    }

    @ApiResponse({
        status: 201,
        description: 'Create place',
        type: PlaceDto,
    })
    @Post('')
    async createPlace(
        @Body() createPlaceDto : CreatePlaceRequest
    ): Promise<PlaceDto>
    {
        return await this.placeService.create(createPlaceDto);
    }
    
    @ApiResponse({
        status: 200,
        description: 'Get place by ID',
        type: PlaceDto,
    })
    @Get(':id')
    async getPlaceById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<PlaceDto>{
        return await this.placeService.getById(id);
    } 
    
    @ApiResponse({
        status: 200,
        description: 'Update place',
        type: PlaceDto,
    })
    @Put(':id')
    async updatePlace(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePlaceDto : UpdatePlaceRequest
    ): Promise<PlaceDto>
    {
        return await this.placeService.updateById(id,updatePlaceDto);
    }
    
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePlace(
        @Param('id', ParseIntPipe) id: number
    ): Promise<void>
    {
        await this.placeService.deleteById(id);
    }

    @ApiResponse({
        status: 200,
        description: 'Get transactions from a place',
        type: [TransactionDto],
    })
    @Get('/:id/transactions')
    async getTransactionsByPlaceId(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: UserSession, 
    ): Promise<GetAllTransactionsResponse>{
        return await this.transactionService.getTransactionsByPlaceId(id,user.id);
    } 
    
    
}
