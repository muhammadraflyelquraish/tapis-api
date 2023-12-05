import { Controller, Post } from '@nestjs/common';
import { FirebaseService } from 'src/services/firebase.service';

@Controller('sso')
export class SsoController {
  constructor(private readonly firebase: FirebaseService) {}

  @Post('sign-up')
  async signUp() {}

  @Post('sign-in')
  async signIn() {}
}
