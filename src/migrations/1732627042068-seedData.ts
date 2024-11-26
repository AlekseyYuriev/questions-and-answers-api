import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedData1732627042068 implements MigrationInterface {
  name = 'SeedData1732627042068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO "role" ("id", "value") 
            VALUES 
            (1, 'ADMIN'),
            (2, 'USER');
        `);

    await queryRunner.query(`
            INSERT INTO "user" ("id", "firstName", "lastName", "email", "password", "roleId")
            VALUES 
            (1, 'Chack', 'Norris', 'chack@norris.com', 'Password531!', 2),
            (2, 'Jane', 'Smith', 'jane@smith.com', 'Password098!', 1);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "user" WHERE id IN (1, 2);
      `);

    await queryRunner.query(`
        DELETE FROM "role" WHERE id IN (1, 2);
      `);
  }
}
