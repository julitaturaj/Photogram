import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('database') as TypeOrmModuleOptions,
      inject: [ConfigService],
    }),
    AuthModule,
  ],
})
export class AppModule {}
