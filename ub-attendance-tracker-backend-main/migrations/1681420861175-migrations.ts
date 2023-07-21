import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1681420861175 implements MigrationInterface {
    name = 'migrations1681420861175'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`affiliationtouser\` (\`affiliation_to_userId\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`affiliationId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`affiliation_to_userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`affiliationtouser\` ADD CONSTRAINT \`FK_bcef9ce15e4f99dd13143dac2c0\` FOREIGN KEY (\`affiliationId\`) REFERENCES \`Affliation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`affiliationtouser\` ADD CONSTRAINT \`FK_8492c8850146f7f1d50a5e0247a\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`affiliationtouser\` DROP FOREIGN KEY \`FK_8492c8850146f7f1d50a5e0247a\``);
        await queryRunner.query(`ALTER TABLE \`affiliationtouser\` DROP FOREIGN KEY \`FK_bcef9ce15e4f99dd13143dac2c0\``);
        await queryRunner.query(`DROP TABLE \`affiliationtouser\``);
    }

}
