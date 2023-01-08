import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import config from './config/config';
import { AuthModule } from './auth/auth.module';
import { PhotoPostModule } from './photoPost/photoPost.module';

const { combine, timestamp, json } = winston.format;
export const getAppInstance = async (): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true, load: [config] }),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) =>
          config.get('testDatabase') as TypeOrmModuleOptions,
        inject: [ConfigService],
      }),
      WinstonModule.forRoot({
        level: 'info',
        format: combine(timestamp(), json()),
        transports: [
          new winston.transports.File({
            filename: 'combined.log',
          }),
        ],
      }),
      AuthModule,
      PhotoPostModule,
    ],
  }).compile();
  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
};
