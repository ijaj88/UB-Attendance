import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Events } from '../entities/event.entity';
import { EventToUserAttendance } from '../entities/eventToUserAttendance.entity';

@Injectable()
export class EventToUserAttendanceRepository extends Repository<EventToUserAttendance> {
  constructor(private dataSource: DataSource) {
    super(EventToUserAttendance, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<EventToUserAttendance> {
    const eventToUserAttendance = await this.findOne({
      where: { eventToUserAttendanceId: id },
      relations: {},
    });
    if (!eventToUserAttendance) {
      throw new NotFoundException();
    }

    return eventToUserAttendance;
  }
}
