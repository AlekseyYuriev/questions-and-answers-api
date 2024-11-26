import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestions1732628641456 implements MigrationInterface {
  name = 'AddQuestions1732628641456';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
              INSERT INTO "question" ("id", "rating", "title", "description", "createdAt", "updatedAt", "authorId")
              VALUES 
              (1, 0, 'New question', 'Question description for test', NOW(), NOW(), 1),
              (2, 0, 'New question 2', 'Question description for better test', NOW(), NOW(), 2);
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DELETE FROM "question" WHERE id IN (1, 2);
        `);
  }
}
