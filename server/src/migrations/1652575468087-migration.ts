import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1652575468087 implements MigrationInterface {
    name = "migration1652575468087";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "fileType" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "fileType"`);
    }
}
