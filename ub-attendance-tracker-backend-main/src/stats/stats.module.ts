import { Module } from '@nestjs/common';
import { EventsModule } from 'src/event/events.module';
import { EventsService } from 'src/event/events.service';
import { EventRepository } from 'src/event/repositories/event.repository';
import { EventStatsRepository } from 'src/event/repositories/events-stats.repository';
import { EventSeriesRepository } from 'src/event/repositories/eventSeries.repository';
import { EventToUserAttendanceRepository } from 'src/event/repositories/eventToUserAttendance.repository';
import { ReasonsModule } from 'src/reasons/reasons.module';
import { SharedModule } from 'src/shared/shared.module';
import { SpaceRepository } from 'src/spaces/repositories/space.repository';
import { SpaceToUserAttendanceRepository } from 'src/spaces/repositories/space-attendance.repository';
import { SpacesModule } from 'src/spaces/spaces.module';
import { SpacesService } from 'src/spaces/spaces.service';
import { UserModule } from 'src/user/user.module';

import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  controllers: [StatsController],
  providers: [
    StatsService,
    EventsService,
    EventRepository,
    SpacesService,
    EventStatsRepository,
    SpaceRepository,
    EventToUserAttendanceRepository,
    SpaceToUserAttendanceRepository,
    EventSeriesRepository,
  ],
  imports: [
    EventsModule,
    SharedModule,
    UserModule,
    ReasonsModule,
    SpacesModule,
  ],
})
export class StatsModule {}
