import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1681086139381 implements MigrationInterface {
    name = 'migrations1681086139381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event_stats\` DROP COLUMN \`query\``);
        await queryRunner.query(`ALTER TABLE \`event_stats\` ADD \`query\` varchar(5000) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event_stats\` DROP COLUMN \`query\``);
        await queryRunner.query(`ALTER TABLE \`event_stats\` ADD \`query\` varchar(510) NOT NULL`);
    }

}
