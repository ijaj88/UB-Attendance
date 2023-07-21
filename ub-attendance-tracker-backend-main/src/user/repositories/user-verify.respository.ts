import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { VerifyUser } from '../entities/user-verification.entity';
@Injectable()
export class UserVerifyRepository extends Repository<VerifyUser> {
  constructor(private dataSource: DataSource) {
    super(VerifyUser, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<VerifyUser> {
    const user = await this.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
