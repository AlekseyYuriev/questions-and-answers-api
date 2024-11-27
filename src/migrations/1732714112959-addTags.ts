import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTags1732714112959 implements MigrationInterface {
  name = 'AddTags1732714112959';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO "tag" ("id", "name", "description", "createDate", "updateDate", "deletedAt")
          VALUES 
          (1, 'javascript', 'All questions javascript', NOW(), NOW(), null),
          (2, 'typescript', 'All questions typescript', NOW(), NOW(), null),
          (3, 'nestjs', 'All questions nestjs', NOW(), NOW(), null);
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DELETE FROM "tag" WHERE id IN (1, 2, 3);
      `);
  }
}
