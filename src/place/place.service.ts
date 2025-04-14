import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/data/prisma.service';
import { CreatePlaceRequest, GetAllPlacesResponse, PlaceDto, UpdatePlaceRequest } from './dto/place.dto';
import { handleDBError } from 'src/core/handleDBError';

@Injectable()
export class PlaceService {
    constructor(private prisma: PrismaService) {}

    async getAll():Promise<GetAllPlacesResponse>{
        return this.prisma.place.findMany();
    }

    async getById(id: number): Promise<PlaceDto> {
        const place = await this.prisma.place.findUnique({
            where: {
              id,
            }, include: {
              transactions: {
                select: {
                  id: true,
                  amount: true,
                  date: true,
                  place: true,
                  user:
                   {
                    select: 
                    {
                        id: true,
                        email: true, 
                    }
                },
                },
              },
            },
          });
          
        if (!place) {
            throw new NotFoundException('No place with this id exists');
        }
        return place;
    }

    async create(
        place : CreatePlaceRequest      
    ): Promise<PlaceDto> {
        try {
            return await this.prisma.place.create({
              data: place,
            });
        } catch (error) {
            throw handleDBError(error);
        } 
    }

    async updateById(
        id: number,
        changes : UpdatePlaceRequest      
    ): Promise<PlaceDto> {
        try {
            return await this.prisma.place.update({
              where: {
                id,
              },
              data: changes,
            });
        } catch (error) {
            throw handleDBError(error);
        }
    }

    async deleteById(
        id: number,  
    ): Promise<void> {
        try {
            await this.prisma.place.delete({
              where: {
                id,
              },
            });
        } catch (error) {
            throw handleDBError(error);
        }
    }

    async checkPlaceExists(id: number): Promise<void> {
        const count = await this.prisma.place.count({
            where: {
                id,
            },
        });
        if (count === 0) {
            throw new NotFoundException('No place with this id exists');
        }
    }


}

