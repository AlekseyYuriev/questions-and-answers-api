import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRole1742558515095 implements MigrationInterface {
  name = 'AddRole1742558515095';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "Role" ("id", "role") 
        VALUES 
        ('3fd8f2a6-e614-4476-b5bd-666532ca2350', 'admin'),
        ('d038507e-caf8-4f1a-a99f-3fcc3e51971d', 'user');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "Role" WHERE id IN ('3fd8f2a6-e614-4476-b5bd-666532ca2350', 'd038507e-caf8-4f1a-a99f-3fcc3e51971d');
      `);
  }
}
