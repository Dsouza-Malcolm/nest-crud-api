import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, validationSchema } from './database';
import { databaseConfig } from './config/env/database.config';
import { appConfig } from './config/env/app.config';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [databaseConfig, appConfig],
    }),
    DatabaseModule,
    HealthModule,
  ],
})
export class AppModule {}
