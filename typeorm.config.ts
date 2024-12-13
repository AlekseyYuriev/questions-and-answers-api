import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

/**
 * Data source configuration for TypeORM with PostgreSQL.
 * Loads environment variables from a `.env` file and initializes the data source.
 */
const AppDataSource = new DataSource({
  /**
   * The type of database being used (PostgreSQL).
   */
  type: 'postgres',

  /**
   * The host address of the database.
   */
  host: process.env.DATABASE_HOST,

  /**
   * The port number on which the database server is running.
   */
  port: +process.env.DATABASE_PORT,

  /**
   * The username for connecting to the database.
   */
  username: process.env.DATABASE_USER,

  /**
   * The password for connecting to the database.
   */
  password: process.env.DATABASE_PASSWORD,

  /**
   * The name of the database to connect to.
   */
  database: process.env.DATABASE_NAME,

  /**
   * Option to synchronize the database schema with the entities.
   * Set to false to prevent automatic synchronization.
   */
  synchronize: false,

  /**
   * Paths to the entity files.
   */
  entities: ['dist/**/*.entity.js'],

  /**
   * Paths to the migration files.
   */
  migrations: ['dist/src/migrations/*.js'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
