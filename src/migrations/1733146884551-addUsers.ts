import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsers1733146884551 implements MigrationInterface {
  name = 'AddUsers1733146884551';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "User" ("id", "firstName", "lastName", "email", "password", "roleId")
        VALUES 
        ('16f9a630-82f0-442d-a246-56e130afcc39', 'Chack', 'Norris', 'chack@norris.com', 'Password531!', '5ceb74ae-d14e-4e3c-9387-0058fd8971c8'),
        ('d0cc8618-66dc-4448-8c5a-9de59c93461d', 'Jane', 'Smith', 'jane@smith.com', 'Password098!', '939e80c4-f1ba-4d8e-82b6-f45d3d75725e');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "User" WHERE id IN ('16f9a630-82f0-442d-a246-56e130afcc39', 'd0cc8618-66dc-4448-8c5a-9de59c93461d');
      `);
  }
}
