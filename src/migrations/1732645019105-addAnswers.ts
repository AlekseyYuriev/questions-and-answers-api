import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAnswers1732645019105 implements MigrationInterface {
  name = 'AddAnswers1732645019105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "answer" ("id", "text", "rating", "createdAt", "updatedAt", "authorId", "questionId")
        VALUES 
        (1, 'This is answer for question 1', 0, NOW(), NOW(), 1, 1),
        (2, 'This is the second answer for question 1', 0, NOW(), NOW(), 1, 1),
        (3, 'This is answer for question 2', 0, NOW(), NOW(), 2, 2),
        (4, 'This is another answer for question 2', 0, NOW(), NOW(), 2, 2);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "answer" WHERE id IN (1, 2, 3, 4);
    `);
  }
}
