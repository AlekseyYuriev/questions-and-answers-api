import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTagsToQuestions1732714194424 implements MigrationInterface {
  name = 'AddTagsToQuestions1732714194424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO "question_tags_tag" ("questionId", "tagId") VALUES (1, 1);
          INSERT INTO "question_tags_tag" ("questionId", "tagId") VALUES (1, 2);
          INSERT INTO "question_tags_tag" ("questionId", "tagId") VALUES (2, 2);
          INSERT INTO "question_tags_tag" ("questionId", "tagId") VALUES (2, 3);
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DELETE FROM "question_tags_tag" WHERE "questionId" = 1 AND "tagId" = 1;
          DELETE FROM "question_tags_tag" WHERE "questionId" = 1 AND "tagId" = 2;
          DELETE FROM "question_tags_tag" WHERE "questionId" = 2 AND "tagId" = 2;
          DELETE FROM "question_tags_tag" WHERE "questionId" = 2 AND "tagId" = 3;
      `);
  }
}
