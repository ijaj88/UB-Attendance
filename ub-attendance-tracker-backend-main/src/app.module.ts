import { Module } from '@nestjs/common';

import { AffiliationModule } from './affiliation/affiliation.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonAffModule } from './commonaff/commonaff.module';
import { EventsModule } from './event/events.module';
import { ReasonsModule } from './reasons/reasons.module';
import { SharedModule } from './shared/shared.module';
import { SpacesModule } from './spaces/spaces.module';
import { StatsModule } from './stats/stats.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SharedModule,
    UserModule,
    AuthModule,
    EventsModule,
    SpacesModule,
    ReasonsModule,
    AffiliationModule,
    StatsModule,
    CommonAffModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
