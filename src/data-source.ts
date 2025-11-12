import { DataSource, DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DB_URL || '';
const dbUser = process.env.DB_USER || '';
const dbPassword = process.env.DB_PASSWORD || '';

const connectionUrl = dbUrl
  .replace('{user}', dbUser)
  .replace('{password}', dbPassword);

console.log('Database connection URL:', connectionUrl);

export default new DataSource({
  type: 'postgres',
  url: connectionUrl,
  entities: ['**/*.entity*{.js,.ts}'],
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
} as DataSourceOptions);
