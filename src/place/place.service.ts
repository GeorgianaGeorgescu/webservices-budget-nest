import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/data/prisma.service';

@Injectable()
export class PlaceService {
    constructor(private prisma: PrismaService) {}
    
    async checkPlaceExists(id: number): Promise<void> {
        const count = await this.prisma.place.count({
            where: {
                id,
            },
        });
        if (count === 0) {
            console.log("Error");
            throw new NotFoundException('No place with this id exists');
        }
    }

}

