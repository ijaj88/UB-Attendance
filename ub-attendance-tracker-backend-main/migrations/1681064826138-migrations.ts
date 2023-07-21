import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1681064826138 implements MigrationInterface {
    name = 'migrations1681064826138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`reasons\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isActive\` tinyint NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`space_to_user_attendance\` (\`spaceToUserAttendanceId\` int NOT NULL AUTO_INCREMENT, \`spaceId\` int NOT NULL, \`userId\` int NOT NULL, \`attended\` tinyint NOT NULL, \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`reasonId\` int NULL, PRIMARY KEY (\`spaceToUserAttendanceId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`spaces\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isActive\` tinyint NULL, \`title\` varchar(255) NULL, \`description\` varchar(255) NULL, \`category\` varchar(255) NULL, \`image\` varchar(255) NULL, \`qr\` varchar(255) NULL, \`type\` varchar(255) NULL, \`organizedBy\` varchar(255) NULL, \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`event_series\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`events\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isActive\` tinyint NULL, \`title\` varchar(255) NULL, \`description\` varchar(255) NULL, \`from\` datetime NULL, \`to\` datetime NULL, \`image\` varchar(255) NULL, \`qr\` varchar(255) NULL, \`type\` varchar(255) NULL, \`organizedBy\` varchar(255) NULL, \`isAccountDisabled\` tinyint NULL, \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`createdById\` int NULL, \`spacesId\` int NULL, \`seriesId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`event_to_user_attendance\` (\`eventToUserAttendanceId\` int NOT NULL AUTO_INCREMENT, \`eventId\` int NOT NULL, \`userId\` int NOT NULL, \`rsvp\` tinyint NOT NULL, \`attended\` tinyint NOT NULL, \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`eventToUserAttendanceId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`password\` varchar(255) NOT NULL, \`ethnicity\` varchar(255) NULL, \`race\` varchar(255) NULL, \`level\` varchar(255) NULL, \`gender\` varchar(255) NULL, \`department\` varchar(255) NULL, \`age\` int NULL, \`username\` varchar(200) NOT NULL, \`roles\` text NULL, \`isAccountDisabled\` tinyint NULL, \`email\` varchar(200) NULL, \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`username\` (\`username\`), UNIQUE INDEX \`email\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Affliation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isActive\` tinyint NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`event_stats\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`uiLocationMetadata\` varchar(255) NULL, \`query\` varchar(510) NOT NULL, \`isActive\` tinyint NOT NULL, \`category\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_affilation_affliation\` (\`usersId\` int NOT NULL, \`affliationId\` int NOT NULL, INDEX \`IDX_6b831d68dd44f51cfbb64908c4\` (\`usersId\`), INDEX \`IDX_929701dff96762dc22609c1c45\` (\`affliationId\`), PRIMARY KEY (\`usersId\`, \`affliationId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`space_to_user_attendance\` ADD CONSTRAINT \`FK_363f0ee87a1aaa09160efabad30\` FOREIGN KEY (\`reasonId\`) REFERENCES \`reasons\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`space_to_user_attendance\` ADD CONSTRAINT \`FK_e28c5760b73ed87ab6ed98c8862\` FOREIGN KEY (\`spaceId\`) REFERENCES \`spaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`space_to_user_attendance\` ADD CONSTRAINT \`FK_9575f87718b8160afacf3e43bfd\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_2fb864f37ad210f4295a09b684d\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_26884c5823ec6764148526becf8\` FOREIGN KEY (\`spacesId\`) REFERENCES \`spaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_e1ec1174aecc496bcdb706ccde9\` FOREIGN KEY (\`seriesId\`) REFERENCES \`event_series\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event_to_user_attendance\` ADD CONSTRAINT \`FK_5c6f016034625b114e913da2d17\` FOREIGN KEY (\`eventId\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event_to_user_attendance\` ADD CONSTRAINT \`FK_62d92a076eff7924d213750eb94\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_affilation_affliation\` ADD CONSTRAINT \`FK_6b831d68dd44f51cfbb64908c43\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_affilation_affliation\` ADD CONSTRAINT \`FK_929701dff96762dc22609c1c45a\` FOREIGN KEY (\`affliationId\`) REFERENCES \`Affliation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_affilation_affliation\` DROP FOREIGN KEY \`FK_929701dff96762dc22609c1c45a\``);
        await queryRunner.query(`ALTER TABLE \`users_affilation_affliation\` DROP FOREIGN KEY \`FK_6b831d68dd44f51cfbb64908c43\``);
        await queryRunner.query(`ALTER TABLE \`event_to_user_attendance\` DROP FOREIGN KEY \`FK_62d92a076eff7924d213750eb94\``);
        await queryRunner.query(`ALTER TABLE \`event_to_user_attendance\` DROP FOREIGN KEY \`FK_5c6f016034625b114e913da2d17\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_e1ec1174aecc496bcdb706ccde9\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_26884c5823ec6764148526becf8\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_2fb864f37ad210f4295a09b684d\``);
        await queryRunner.query(`ALTER TABLE \`space_to_user_attendance\` DROP FOREIGN KEY \`FK_9575f87718b8160afacf3e43bfd\``);
        await queryRunner.query(`ALTER TABLE \`space_to_user_attendance\` DROP FOREIGN KEY \`FK_e28c5760b73ed87ab6ed98c8862\``);
        await queryRunner.query(`ALTER TABLE \`space_to_user_attendance\` DROP FOREIGN KEY \`FK_363f0ee87a1aaa09160efabad30\``);
        await queryRunner.query(`DROP INDEX \`IDX_929701dff96762dc22609c1c45\` ON \`users_affilation_affliation\``);
        await queryRunner.query(`DROP INDEX \`IDX_6b831d68dd44f51cfbb64908c4\` ON \`users_affilation_affliation\``);
        await queryRunner.query(`DROP TABLE \`users_affilation_affliation\``);
        await queryRunner.query(`DROP TABLE \`event_stats\``);
        await queryRunner.query(`DROP TABLE \`Affliation\``);
        await queryRunner.query(`DROP INDEX \`email\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`username\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`event_to_user_attendance\``);
        await queryRunner.query(`DROP TABLE \`events\``);
        await queryRunner.query(`DROP TABLE \`event_series\``);
        await queryRunner.query(`DROP TABLE \`spaces\``);
        await queryRunner.query(`DROP TABLE \`space_to_user_attendance\``);
        await queryRunner.query(`DROP TABLE \`reasons\``);
    }

}
