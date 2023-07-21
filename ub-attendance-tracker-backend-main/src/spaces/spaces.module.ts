import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthStrategy } from 'src/auth/strategies/jwt-auth.strategy';
import { ReasonsModule } from 'src/reasons/reasons.module';
import { ReasonsService } from 'src/reasons/reasons.service';
import { SharedModule } from 'src/shared/shared.module';
import { UserAclService } from 'src/user/services/user-acl.service';
import { UserModule } from 'src/user/user.module';

import { Spaces } from './entities/space.entity';
import { SpaceRepository } from './repositories/space.repository';
import { SpaceToUserAttendanceRepository } from './repositories/space-attendance.repository';
import { SpaceAclService } from './space-acl.service';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';

@Module({
  controllers: [SpacesController],
  providers: [
    SpacesService,
    JwtAuthStrategy,
    UserAclService,
    SpaceRepository,
    SpaceToUserAttendanceRepository,
    ReasonsService,
    SpaceAclService,
  ],
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Spaces]),
    UserModule,
    ReasonsModule,
  ],
  exports: [
    TypeOrmModule.forFeature([Spaces]),
    SpaceRepository,
    SpaceToUserAttendanceRepository,
    SpaceAclService,
  ],
})
export class SpacesModule {}
