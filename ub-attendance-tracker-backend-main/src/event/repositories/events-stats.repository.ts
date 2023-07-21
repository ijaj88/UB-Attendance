import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Events } from '../entities/event.entity';
import { EventStats } from '../entities/eventStats.entity';

@Injectable()
export class EventStatsRepository extends Repository<EventStats> {
  constructor(private dataSource: DataSource) {
    super(EventStats, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<EventStats> {
    const eventstats = await this.findOne({
      where: { id },
    });
    if (!eventstats) {
      throw new NotFoundException();
    }

    return eventstats;
  }
}
