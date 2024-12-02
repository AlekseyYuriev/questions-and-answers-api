import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTags1733147530863 implements MigrationInterface {
  name = 'AddTags1733147530863';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "Tag" ("id", "name", "description", "createDate", "updateDate")
        VALUES 
        ('374fb32e-417a-4497-b677-f57e4292c76e', 'javascript', 'All questions javascript', NOW(), NOW()),
        ('3c24f880-1902-4c6f-b1c6-678756009df7', 'typescript', 'All questions typescript', NOW(), NOW()),
        ('8823fc8e-9d49-43da-ae60-735fe1949624', 'nestjs', 'All questions nestjs', NOW(), NOW());
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "Tag" WHERE id IN ('374fb32e-417a-4497-b677-f57e4292c76e', '3c24f880-1902-4c6f-b1c6-678756009df7', '8823fc8e-9d49-43da-ae60-735fe1949624');
    `);
  }
}
