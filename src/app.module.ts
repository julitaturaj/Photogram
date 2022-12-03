import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import winston from 'winston';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
const { combine, timestamp, json } = winston.format;

import { AuthModule } from './auth/auth.module';
import config from './config/config';
import { PhotoPostModule } from './photoPost/photoPost.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule,
        WinstonModule.forRoot({
          level: 'info',
          format: combine(timestamp(), json()),
          transports: [
            new winston.transports.File({
              filename: 'combined.log',
            }),
          ],
        }),
      ],
      useFactory: async (configService: ConfigService) =>
        configService.get('database') as TypeOrmModuleOptions,
      inject: [ConfigService],
    }),
    AuthModule,
    PhotoPostModule,
  ],
})
export class AppModule {}
