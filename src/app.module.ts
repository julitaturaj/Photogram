import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import winston from 'winston';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
const { combine, timestamp, json } = winston.format;

import { AuthModule } from './auth/auth.module';
import config from './config/config';
import { PhotoPostModule } from './photoPost/photoPost.module';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
      serveRoot: '/files',
    }),
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
