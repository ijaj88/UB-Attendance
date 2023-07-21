import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Spaces } from '../entities/space.entity';

@Injectable()
export class SpaceRepository extends Repository<Spaces> {
  constructor(private dataSource: DataSource) {
    super(Spaces, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Spaces> {
    const space = await this.findOne({
      where: { id },
      relations: {},
    });
    if (!space) {
      throw new NotFoundException();
    }

    return space;
  }
}
