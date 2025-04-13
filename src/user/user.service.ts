import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/data/prisma.service';
import { PublicUserDto, UpdateUserRequest, UpdateUserResponse } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { handleDBError } from 'src/core/handleDBError';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  async getAll():Promise<PublicUserDto[]>{
    const users = await this.prisma.user.findMany();
    return users.map((user) => plainToInstance(PublicUserDto, user, { excludeExtraneousValues: true }));
  }

  async getById(id: number): Promise<PublicUserDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return plainToInstance(PublicUserDto, user, { excludeExtraneousValues: true });
  }

  async deleteById(id:number):Promise<void>{
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw handleDBError(error);
    }
  }

  async updateById(id:number,changes:UpdateUserRequest):Promise<UpdateUserResponse>{
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: changes,
      });
      return plainToInstance(PublicUserDto, user, { excludeExtraneousValues: true });
    } catch (error) {
      throw handleDBError(error);
    }
  }

      
}
