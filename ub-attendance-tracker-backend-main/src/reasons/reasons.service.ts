import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { CreateReasonInput } from './dto/create-reason.dto';
import { UpdateReasonInput } from './dto/update-reason.dto';
import { Reasons } from './entities/reasons.entity';
import { ReasonRepository } from './repositories/reason.repository';

@Injectable()
export class ReasonsService {
  constructor(private readonly repository: ReasonRepository) {}

  async listReasons() {
    return await this.repository.findAndCount({
      where: {
        isActive: true,
      },
    }); 
  }
  async updateReason(id: number, input: UpdateReasonInput) {
    const reason = await this.repository.findOne({ where: { id } });

    const updatedAff: Reasons = {
      ...reason,
      ...plainToClass(Reasons, input),
    };

    const updateResult = await this.repository.save(updatedAff);

    return updateResult;
  }
  async deleteReason(id: number) {
    const affilation = await this.repository.delete(id);
    return affilation;
  }

  async findOneById(id: number) {
    const reason = await this.repository.findOne({ where: { id: id } });
    return reason;
  }

  async createNewReason(input: CreateReasonInput) {
    const reason = plainToClass(Reasons, input);
    reason.isActive = true;
    return await this.repository.save(reason);
  }
}
