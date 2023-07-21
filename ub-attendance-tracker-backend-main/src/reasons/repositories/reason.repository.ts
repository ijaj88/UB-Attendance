import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Reasons } from '../entities/reasons.entity';

@Injectable()
export class ReasonRepository extends Repository<Reasons> {
  constructor(private dataSource: DataSource) {
    super(Reasons, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Reasons> {
    const reason = await this.findOne({
      where: { id },
      relations: {},
    });
    if (!reason) {
      throw new NotFoundException();
    }

    return reason;
  }
}
