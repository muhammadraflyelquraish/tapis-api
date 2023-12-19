import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/app.controller';
import { SsoController } from './controllers/sso/sso.controller';
import { TapisController } from './controllers/tapis/tapis.controller';

import { FirebaseService } from './services/firebase.service';
import { PrismaService } from './services/prisma.service';
import { AreaController } from './controllers/area/area.controller';

@Module({
  imports: [
    /**
     * Load .env, development purpose
     * make ignoreEnvFile: false, if u want to load .env direcly
     *
     */
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
    }),
  ],
  controllers: [AppController, SsoController, TapisController, AreaController],
  providers: [FirebaseService, PrismaService],
})
export class AppModule {}
