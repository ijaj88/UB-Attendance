import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AffiliationController } from './affiliation.controller';
import { AffiliationService } from './affiliation.service';
import { Affiliation } from './entities/affiliation.entity';
import { AffiliationRepository } from './repositories/affiliation.repository';
import { AffiliationToUserRepository } from './repositories/affiliation-user.repository';

@Module({
  controllers: [AffiliationController],
  providers: [AffiliationService, AffiliationRepository,AffiliationToUserRepository],
  imports: [TypeOrmModule.forFeature([Affiliation])],
  exports: [AffiliationService,AffiliationToUserRepository,AffiliationRepository],
})
export class AffiliationModule {}
