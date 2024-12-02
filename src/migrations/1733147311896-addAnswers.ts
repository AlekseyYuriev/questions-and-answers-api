import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAnswers1733147311896 implements MigrationInterface {
  name = 'AddAnswers1733147311896';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "Answer" ("id", "text", "rating", "createdAt", "updatedAt", "authorId", "questionId")
        VALUES 
        ('9f2d782f-2b97-4d14-9e31-2bb87b6f7261', 'This is answer for question 1', 0, NOW(), NOW(), '16f9a630-82f0-442d-a246-56e130afcc39', 'fbad309a-c386-4bf7-b8a9-9a3c3939d7cb'),
        ('7c21d879-827c-4c4d-9266-7cd16264433e', 'This is the second answer for question 1', 0, NOW(), NOW(), '16f9a630-82f0-442d-a246-56e130afcc39', 'fbad309a-c386-4bf7-b8a9-9a3c3939d7cb'),
        ('0fa495b8-5ad2-43b2-b3bd-f09d422ddd0d', 'This is answer for question 2', 0, NOW(), NOW(), 'd0cc8618-66dc-4448-8c5a-9de59c93461d', 'bcfc6b86-c9ba-4fbb-9ca2-5658b3ddbc02'),
        ('1b2add46-b0fa-40df-9f13-4650f847ff60', 'This is another answer for question 2', 0, NOW(), NOW(), 'd0cc8618-66dc-4448-8c5a-9de59c93461d', 'bcfc6b86-c9ba-4fbb-9ca2-5658b3ddbc02');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "Answer" WHERE id IN ('9f2d782f-2b97-4d14-9e31-2bb87b6f7261', '7c21d879-827c-4c4d-9266-7cd16264433e', '0fa495b8-5ad2-43b2-b3bd-f09d422ddd0d', '1b2add46-b0fa-40df-9f13-4650f847ff60');
    `);
  }
}
