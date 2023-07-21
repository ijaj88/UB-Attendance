import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliationModule } from 'src/affiliation/affiliation.module';
import { AffiliationService } from 'src/affiliation/affiliation.service';
import { Affiliation } from 'src/affiliation/entities/affiliation.entity';
import { AffiliationRepository } from 'src/affiliation/repositories/affiliation.repository';
import { UserService } from 'src/user/services/user.service';
import { UserModule } from 'src/user/user.module';

import { CommonAffController } from './commonaff.controller';
import { CommonAffService } from './commonaff.service';
import {AffiliationAclService} from './commonaff-acl.service'
@Module({
  controllers: [CommonAffController],
  providers: [CommonAffService,AffiliationRepository,AffiliationAclService],
  imports: [TypeOrmModule.forFeature([Affiliation]),UserModule,AffiliationModule],
})
export class CommonAffModule {}
