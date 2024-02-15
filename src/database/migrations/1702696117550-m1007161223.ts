import { MigrationInterface, QueryRunner } from "typeorm";

export class M10071612231702696117550 implements MigrationInterface {
    name = 'M10071612231702696117550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "language" (
                "id" character varying NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "language"
        `);
    }

}
