import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as csv from 'fast-csv';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EventStatParam, EventStatQuery } from 'src/event/dto/event-stats.dto';
import { EventsService } from 'src/event/events.service';
import { ReqContext } from 'src/shared/request-context/req-context.decorator';
import { RequestContext } from 'src/shared/request-context/request-context.dto';

@ApiTags('Statistics')
@Controller('stats')
export class StatsController {
  constructor(private readonly eventService: EventsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async getEventStats(
    @ReqContext() ctx: RequestContext,
    @Query() query: EventStatQuery,
    @Param() stat: EventStatParam,
    @Res() res,
  ): Promise<any> {
    // this.logger.log(ctx, `${this.getEventSeries.name} was called`);
    const stats = await this.eventService.executeQuery(stat.id, query, ctx);
    if (query.file) {
      const csvStream = csv.format({ headers: true });
      stats.forEach((stat) => csvStream.write(stat));
      csvStream.end();

      const csvData = [];
      csvStream.on('data', (data) => csvData.push(data));
      csvStream.on('end', () => {
        const csvContent = csvData.join('\n');
        res.set({
          'Content-Disposition': `attachment; filename="${stat.id}.csv"`,
          'Content-Type': 'text/csv',
        });
        res.send(csvContent);
      });
    } else {
      console.log('In here');
      res.send({ data: stats, meta: {} });
    }
  }
}
