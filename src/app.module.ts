import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { appConfig } from './core/config/env/app.config';
import { databaseConfig } from './core/config/env/database.config';
import { jwtConfig } from './core/config/env/jwt.config';
import { DatabaseModule, validationSchema } from './database';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { MockModule } from './modules/mock/mock.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UserModule } from './modules/users/user.module';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';

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
    TasksModule,
    MockModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {}
