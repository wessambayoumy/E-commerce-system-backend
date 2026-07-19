import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/get-all-users')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
  @Get('/get-user/:user-id')
  getOneUser(@Param() params: string) {
    return this.userService.getOneUser(params);
  }
  @Post('/create-user')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }
  @Patch('/update-user/:user-id')
  updateUser(@Param() params: string, @Body() body: any) {
    return this.userService.updateUser(params, body);
  }
  @Delete('/delete-user/:user-id')
  deleteUser(@Param() params: string) {
    return this.userService.deleteUser(params);
  }
}
