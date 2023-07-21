import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Events } from '../entities/event.entity';

@Injectable()
export class EventRepository extends Repository<Events> {
  constructor(private dataSource: DataSource) {
    super(Events, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Events> {
    const event = await this.findOne({
      where: { id },
      relations: { createdBy: true, spaces: true, series: true },
    });
    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }
}
