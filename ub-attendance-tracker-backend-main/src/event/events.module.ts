import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthStrategy } from 'src/auth/strategies/jwt-auth.strategy';
import { ReasonsModule } from 'src/reasons/reasons.module';
import { SharedModule } from 'src/shared/shared.module';
import { SpacesModule } from 'src/spaces/spaces.module';
import { SpacesService } from 'src/spaces/spaces.service';
import { UserAclService } from 'src/user/services/user-acl.service';
import { UserModule } from 'src/user/user.module';

import { Events } from './entities/event.entity';
import { EventSeries } from './entities/eventSeries.entity';
import { EventStats } from './entities/eventStats.entity';
import { EventToUserAttendance } from './entities/eventToUserAttendance.entity';
import { EventAclService } from './event-acl.service';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventRepository } from './repositories/event.repository';
import { EventStatsRepository } from './repositories/events-stats.repository';
import { EventSeriesRepository } from './repositories/eventSeries.repository';
import { EventToUserAttendanceRepository } from './repositories/eventToUserAttendance.repository';

@Module({
  controllers: [EventsController],
  providers: [
    EventsService,
    JwtAuthStrategy,
    UserAclService,
    EventRepository,
    SpacesService,
    EventAclService,
    EventToUserAttendanceRepository,
    EventSeriesRepository,
    EventStatsRepository,
  ],
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      Events,
      EventToUserAttendance,
      EventSeries,
      EventStats,
    ]),
    UserModule,
    SpacesModule,
    ReasonsModule,
  ],
  exports: [
    EventToUserAttendanceRepository,
    EventSeriesRepository,
    EventAclService,
    TypeOrmModule.forFeature([
      Events,
      EventToUserAttendance,
      EventSeries,
      EventStats,
    ]),
  ],
})
export class EventsModule {}
