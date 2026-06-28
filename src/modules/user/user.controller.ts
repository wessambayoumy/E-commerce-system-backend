import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { FastifyReply } from 'fastify';
import { CreateUserDto } from './dto';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(@Res() res: FastifyReply) {
    const data = this.userService.getAllUsers();
    return res.send(data);
  }
  @Get('/:user-id')
  getOneUser(@Res() res: FastifyReply, @Param() params: string) {
    const data = this.userService.getOneUser(params);
    return res.send(data);
  }
  @Post()
  createUser(
    @Res() res: FastifyReply,
    @Body(new ValidationPipe()) body: CreateUserDto,
  ) {
    const data = this.userService.createUser(body);
    return res.send(data);
  }
  @Patch()
  updateUser(@Res() res: FastifyReply) {
    const data = this.userService.updateUser();
    return res.send(data);
  }
  @Delete()
  deleteUser(@Res() res: FastifyReply) {
    const data = this.userService.deleteUser();
    return res.send(data);
  }
}
