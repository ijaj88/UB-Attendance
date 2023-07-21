import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reasons } from './entities/reasons.entity';
import { ReasonsController } from './reasons.controller';
import { ReasonsService } from './reasons.service';
import { ReasonRepository } from './repositories/reason.repository';

@Module({
  controllers: [ReasonsController],
  providers: [ReasonsService, ReasonRepository],
  imports: [TypeOrmModule.forFeature([Reasons])],
  exports: [
    TypeOrmModule.forFeature([Reasons]),
    ReasonsService,
    ReasonRepository,
  ],
})
export class ReasonsModule {}
