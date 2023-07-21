import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AffiliationToUser } from '../entities/affiliation_to_user.entity';

@Injectable()
export class AffiliationToUserRepository extends Repository<AffiliationToUser> {
  constructor(private dataSource: DataSource) {
    super(AffiliationToUser, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<AffiliationToUser> {
    const spaceToUserAttendance = await this.findOne({
      where: { affiliation_to_userId: id },
      relations: {},
    });
    if (!spaceToUserAttendance) {
      throw new NotFoundException();
    }

    return spaceToUserAttendance;
  }
}