import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CheckUserAccessGuard } from 'src/guards/userAccess.guard';
import { ParseUserIdPipe } from 'src/core/pipes/parseUserId.pipe';
import { CurrentUser } from 'src/core/decorators/currentUser.decorator';
import { AdminGuard } from 'src/guards/roles.guard';
import { UpdateUserRequest } from './dto/user.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  @UseGuards(AdminGuard) 
  async getAllUsers(){
    return await this.userService.getAll();
  }

  @Get(':id')
  @UseGuards(CheckUserAccessGuard) 
  async getUserById( @Param('id', ParseUserIdPipe) id: string | number,
  @CurrentUser() user: any){
    const userId = id === 'me' ? user.id : id;
    return await this.userService.getById(userId);
  }

  @Delete(':id')
  @UseGuards(CheckUserAccessGuard) 
  async deleteUserById(@Param('id', ParseIntPipe) id: number){
    return await this.userService.deleteById(id);
  }

  @Put(':id')
  @UseGuards(CheckUserAccessGuard)
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserRequest) {
      return await this.userService.updateById(id, updateUserDto);
    }

}
