import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { SpaceToUserAttendance } from '../entities/spaceToUserAttendance.entity';

@Injectable()
export class SpaceToUserAttendanceRepository extends Repository<SpaceToUserAttendance> {
  constructor(private dataSource: DataSource) {
    super(SpaceToUserAttendance, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<SpaceToUserAttendance> {
    const spaceToUserAttendance = await this.findOne({
      where: { spaceToUserAttendanceId: id },
      relations: {},
    });
    if (!spaceToUserAttendance) {
      throw new NotFoundException();
    }

    return spaceToUserAttendance;
  }
}
