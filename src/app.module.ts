import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { SsoController } from './controllers/sso/sso.controller';
import { TapisController } from './controllers/tapis/tapis.controller';

import { FirebaseService } from './services/firebase.service';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [],
  controllers: [AppController, SsoController, TapisController],
  providers: [FirebaseService, PrismaService],
})
export class AppModule {}
