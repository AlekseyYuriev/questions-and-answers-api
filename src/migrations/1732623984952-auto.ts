import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1732623984952 implements MigrationInterface {
    name = 'Auto1732623984952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying(256) NOT NULL, "description" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "rating" integer NOT NULL DEFAULT '0', "title" character varying(512) NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "authorId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer" ("id" SERIAL NOT NULL, "text" text NOT NULL, "rating" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "authorId" integer, "questionId" integer, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "value" character varying(96) NOT NULL, CONSTRAINT "UQ_98082dbb08817c9801e32dd0155" UNIQUE ("value"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying(96) NOT NULL, "lastName" character varying(96), "email" character varying(96) NOT NULL, "password" character varying(96) NOT NULL, "roleId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question_tags_tag" ("questionId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_91ee6aab8dabacfdc162a45e5d4" PRIMARY KEY ("questionId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fa1cf45c0ee075fd02b0009a0d" ON "question_tags_tag" ("questionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c92b89d6b96fe844dce95d4e4b" ON "question_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_75fc761f2752712276be38e7d13" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_328f85639a97f8ff158e0cf7b1f" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_tags_tag" ADD CONSTRAINT "FK_fa1cf45c0ee075fd02b0009a0d4" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "question_tags_tag" ADD CONSTRAINT "FK_c92b89d6b96fe844dce95d4e4bd" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_tags_tag" DROP CONSTRAINT "FK_c92b89d6b96fe844dce95d4e4bd"`);
        await queryRunner.query(`ALTER TABLE "question_tags_tag" DROP CONSTRAINT "FK_fa1cf45c0ee075fd02b0009a0d4"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_328f85639a97f8ff158e0cf7b1f"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_75fc761f2752712276be38e7d13"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c92b89d6b96fe844dce95d4e4b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fa1cf45c0ee075fd02b0009a0d"`);
        await queryRunner.query(`DROP TABLE "question_tags_tag"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }

}
