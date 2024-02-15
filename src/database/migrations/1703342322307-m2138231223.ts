import { MigrationInterface, QueryRunner } from "typeorm";

export class M21382312231703342322307 implements MigrationInterface {
    name = 'M21382312231703342322307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_preference" (
                "id" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "partnerDescription" character varying NOT NULL,
                "locationRange" integer NOT NULL,
                "ageRangeMin" integer NOT NULL,
                "ageRangeMax" integer NOT NULL,
                CONSTRAINT "REL_5b141fbd1fef95a0540f7e7d1e" UNIQUE ("userId"),
                CONSTRAINT "PK_0532217bd629d0ccf06499c5841" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "topic" (
                "id" character varying NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_topic" (
                "id" character varying NOT NULL,
                "topicId" character varying NOT NULL,
                "userId" character varying NOT NULL,
                CONSTRAINT "UQ_020c6c2d4249a3ba77495f6b9a9" UNIQUE ("topicId", "userId"),
                CONSTRAINT "PK_73f13c58a72b763e49c5c4c8c45" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" character varying NOT NULL,
                "name" character varying NOT NULL,
                "email" character varying NOT NULL DEFAULT '',
                "photo" character varying NOT NULL DEFAULT '',
                "phoneNumber" character varying NOT NULL DEFAULT '',
                "introduction" character varying NOT NULL DEFAULT '',
                "dateOfBirth" TIMESTAMP WITH TIME ZONE,
                "gender" character varying,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_language" (
                "id" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "languageId" character varying NOT NULL,
                "proficiency" integer NOT NULL,
                "type" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_af83763d8a9fe1919ca7441b7f0" UNIQUE ("userId", "languageId"),
                CONSTRAINT "PK_948d2ecd168ffdbb308c1bc8a27" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "user_preference"
            ADD CONSTRAINT "FK_5b141fbd1fef95a0540f7e7d1e2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_topic"
            ADD CONSTRAINT "FK_d7f2608453a4ba340e765473195" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_topic"
            ADD CONSTRAINT "FK_075e0e1c1c27ce4b44304b42dc6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_language"
            ADD CONSTRAINT "FK_43d5b919c56d00a9f61ae8bf4cf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_language"
            ADD CONSTRAINT "FK_ce64abf864b84feda3b2d3d923e" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_language" DROP CONSTRAINT "FK_ce64abf864b84feda3b2d3d923e"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_language" DROP CONSTRAINT "FK_43d5b919c56d00a9f61ae8bf4cf"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_topic" DROP CONSTRAINT "FK_075e0e1c1c27ce4b44304b42dc6"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_topic" DROP CONSTRAINT "FK_d7f2608453a4ba340e765473195"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_preference" DROP CONSTRAINT "FK_5b141fbd1fef95a0540f7e7d1e2"
        `);
        await queryRunner.query(`
            DROP TABLE "user_language"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TABLE "user_topic"
        `);
        await queryRunner.query(`
            DROP TABLE "topic"
        `);
        await queryRunner.query(`
            DROP TABLE "user_preference"
        `);
    }

}
