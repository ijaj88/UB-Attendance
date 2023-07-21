import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Events } from '../entities/event.entity';
import { EventSeries } from '../entities/eventSeries.entity';

@Injectable()
export class EventSeriesRepository extends Repository<EventSeries> {
  constructor(private dataSource: DataSource) {
    super(EventSeries, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<EventSeries> {
    const eventSeries = await this.findOne({
      where: { id },
    });
    if (!eventSeries) {
      throw new NotFoundException();
    }

    return eventSeries;
  }
}
