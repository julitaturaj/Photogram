import { TypeOrmModuleOptions } from '@nestjs/typeorm';
require('dotenv').config();

const database: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3000,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true,
};

export default () => ({
  database,
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: 3600,
    },
  },
});
