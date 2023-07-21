import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Affiliation } from '../entities/affiliation.entity';

@Injectable()
export class AffiliationRepository extends Repository<Affiliation> {
  constructor(private dataSource: DataSource) {
    super(Affiliation, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Affiliation> {
    const affiliation = await this.findOne({
      where: { id },
      relations: {},
    });
    if (!affiliation) {
      throw new NotFoundException();
    }

    return affiliation;
  }
}
