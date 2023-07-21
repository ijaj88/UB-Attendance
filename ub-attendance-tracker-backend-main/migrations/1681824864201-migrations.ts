import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1681824864201 implements MigrationInterface {
    name = 'migrations1681824864201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`passToken\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`passToken\``);
    }

}
