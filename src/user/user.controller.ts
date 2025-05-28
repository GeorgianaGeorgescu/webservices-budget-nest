import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';
import { CheckUserAccessGuard } from '../guards/userAccess.guard';
import { ParseUserIdPipe } from '../core/pipes/parseUserId.pipe';
import { CurrentUser } from '../core/decorators/currentUser.decorator';
import { AdminGuard } from '../guards/roles.guard';
import { PublicUserDto, UpdateUserRequest, UpdateUserResponse, UserSession } from './dto/user.dto';
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}
  
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: [PublicUserDto],
  })
  @Get('')
  @UseGuards(AdminGuard) 
  async getAllUsers(): Promise<PublicUserDto[]> {
    return await this.userService.getAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Get user by ID',
    type: PublicUserDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'me',
  })
  @Get(':id')
  @UseGuards(CheckUserAccessGuard) 
  async getUserById( @Param('id', ParseUserIdPipe) id: string | number,
  @CurrentUser() user: UserSession) : Promise<PublicUserDto> {
    const userId = id === 'me' ? user.id : id as number;
    return await this.userService.getById(userId);
  }


  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CheckUserAccessGuard) 
  async deleteUserById(@Param('id', ParseIntPipe) id: number):Promise<void>{
    return await this.userService.deleteById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update user by ID',
    type: UpdateUserResponse,
  })
  @Put(':id')
  @UseGuards(CheckUserAccessGuard)
  async updateUserById
  ( @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserRequest
  ) : Promise<UpdateUserResponse> {
    return await this.userService.updateById(id, updateUserDto);
  }

}
