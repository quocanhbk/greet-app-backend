import { MigrationInterface, QueryRunner } from "typeorm";

export class M23242312231703348694348 implements MigrationInterface {
    name = 'M23242312231703348694348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_preference"
            ALTER COLUMN "partnerDescription"
            SET DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "user_preference"
            ALTER COLUMN "locationRange" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_preference"
            ALTER COLUMN "ageRangeMin"
            SET DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "user_preference"
            ALTER COLUMN "ageRangeMax"
            SET DEFAULT '99'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_preference"
            ALTER COLUMN "ageRangeMax" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "user_preference"
            ALTER COLUMN "ageRangeMin" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "user_preference"
            ALTER COLUMN "locationRange"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_preference"
            ALTER COLUMN "partnerDescription" DROP DEFAULT
        `);
    }

}
