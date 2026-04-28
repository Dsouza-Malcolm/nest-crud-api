import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './core/config/env/app.config';
import { databaseConfig } from './core/config/env/database.config';
import { jwtConfig } from './core/config/env/jwt.config';
import { DatabaseModule, validationSchema } from './database';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { UserModule } from './modules/users/user.module';
import { TasksModule } from './modules/tasks/tasks.module';

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
  ],
})
export class AppModule {}
