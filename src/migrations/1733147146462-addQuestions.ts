import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestions1733147146462 implements MigrationInterface {
  name = 'AddQuestions1733147146462';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "Question" ("id", "rating", "title", "description", "createdAt", "updatedAt", "authorId")
        VALUES 
        ('fbad309a-c386-4bf7-b8a9-9a3c3939d7cb', 0, 'New question', 'Question description for test', NOW(), NOW(), '16f9a630-82f0-442d-a246-56e130afcc39'),
        ('bcfc6b86-c9ba-4fbb-9ca2-5658b3ddbc02', 0, 'New question 2', 'Question description for better test', NOW(), NOW(), 'd0cc8618-66dc-4448-8c5a-9de59c93461d');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "Question" WHERE id IN ('fbad309a-c386-4bf7-b8a9-9a3c3939d7cb', 'bcfc6b86-c9ba-4fbb-9ca2-5658b3ddbc02');
      `);
  }
}
