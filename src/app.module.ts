import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, validationSchema } from './database';
import { databaseConfig } from './core/config/env/database.config';
import { appConfig } from './core/config/env/app.config';
import { HealthModule } from './modules/health/health.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { jwtConfig } from './core/config/env/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [databaseConfig, appConfig, jwtConfig],
    }),
    DatabaseModule,
    HealthModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
