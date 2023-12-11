import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FirebaseService } from 'src/services/firebase.service';
import { CreateUserDto } from './sso.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/common/decorator';
import { FirebaseUserDto } from 'src/common/dto';

@Controller('sso')
export class SsoController {
  constructor(private readonly firebase: FirebaseService) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    const user = await this.firebase.createUser(body);
    return user;
  }

  @Post('verify-token')
  async verifyToken(@Body('token') token: string) {
    const user = await this.firebase.verifyToken(token);
    return user;
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async profile(@User() authUser: FirebaseUserDto) {
    const user = await this.firebase.getUserById(authUser.uid);
    return user;
  }
}
