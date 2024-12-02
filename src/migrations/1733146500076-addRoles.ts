import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoles1733146500076 implements MigrationInterface {
  name = 'AddRoles1733146500076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "Role" ("id", "value") 
        VALUES 
        ('5ceb74ae-d14e-4e3c-9387-0058fd8971c8', 'ADMIN'),
        ('939e80c4-f1ba-4d8e-82b6-f45d3d75725e', 'USER');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "Role" WHERE id IN ('5ceb74ae-d14e-4e3c-9387-0058fd8971c8', '939e80c4-f1ba-4d8e-82b6-f45d3d75725e');
      `);
  }
}
