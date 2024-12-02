import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTagsToQuestions1733147685737 implements MigrationInterface {
  name = 'AddTagsToQuestions1733147685737';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "question_tags_tag" ("questionId", "tagId") VALUES ('bcfc6b86-c9ba-4fbb-9ca2-5658b3ddbc02', '374fb32e-417a-4497-b677-f57e4292c76e');
        INSERT INTO "question_tags_tag" ("questionId", "tagId") VALUES ('bcfc6b86-c9ba-4fbb-9ca2-5658b3ddbc02', '3c24f880-1902-4c6f-b1c6-678756009df7');
        INSERT INTO "question_tags_tag" ("questionId", "tagId") VALUES ('fbad309a-c386-4bf7-b8a9-9a3c3939d7cb', '3c24f880-1902-4c6f-b1c6-678756009df7');
        INSERT INTO "question_tags_tag" ("questionId", "tagId") VALUES ('fbad309a-c386-4bf7-b8a9-9a3c3939d7cb', '8823fc8e-9d49-43da-ae60-735fe1949624');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "question_tags_tag" WHERE "questionId" = 'bcfc6b86-c9ba-4fbb-9ca2-5658b3ddbc02' AND "tagId" = '374fb32e-417a-4497-b677-f57e4292c76e';
        DELETE FROM "question_tags_tag" WHERE "questionId" = 'bcfc6b86-c9ba-4fbb-9ca2-5658b3ddbc02' AND "tagId" = '3c24f880-1902-4c6f-b1c6-678756009df7';
        DELETE FROM "question_tags_tag" WHERE "questionId" = 'fbad309a-c386-4bf7-b8a9-9a3c3939d7cb' AND "tagId" = '3c24f880-1902-4c6f-b1c6-678756009df7';
        DELETE FROM "question_tags_tag" WHERE "questionId" = 'fbad309a-c386-4bf7-b8a9-9a3c3939d7cb' AND "tagId" = '8823fc8e-9d49-43da-ae60-735fe1949624';
    `);
  }
}
