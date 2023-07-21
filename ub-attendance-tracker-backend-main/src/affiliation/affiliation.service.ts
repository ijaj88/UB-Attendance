import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { RequestContext } from '../shared/request-context/request-context.dto';
import { CreateAffiliationDto } from './dto/create-affiliation.dto';
import { CreateUserAffiliationDto } from './dto/create-user-affilation.dto'; 
import { UpdateAffiliationDTO } from './dto/update-affiliation.dto';
import { Affiliation } from './entities/affiliation.entity';
import { AffiliationRepository } from './repositories/affiliation.repository';

@Injectable()
export class AffiliationService {
  constructor(private readonly repository: AffiliationRepository) {}

  async listAffiliation() {
    return await this.repository.findAndCount({});
  }

  async createNewAffiliation(ctx: RequestContext,input: CreateAffiliationDto) {
    const affiliation = plainToClass(Affiliation, input);
    affiliation.isActive = true;
    affiliation.userId = ctx.user.id;
    return await this.repository.save(affiliation);
  }
  

  async createDuringRegistration(input: CreateUserAffiliationDto) {
    const affiliation = plainToClass(Affiliation,input);
    affiliation.isActive = true;
    await this.repository.save({name: input.name, isActive:true,userId: input.id});

  // await this.repository.save({name: "mandatory", isActive:true});
  }

  async getAffilationByIdInternal(id: number) {
    const affiliation = await this.repository.findOne({
      where: {
        id,
        isActive: true,
      },
    });
    return affiliation;
  }

  async updateAffiliation(ctx: RequestContext,id: number, input: UpdateAffiliationDTO) {
    const affilation = await this.repository.findOne({ where: { id } });

    const updatedAff: Affiliation = {
      ...affilation,
      ...plainToClass(Affiliation, input),
    };

    const updateResult = await this.repository.save(updatedAff);

    return updateResult;
  }


  async giveinoutputformat(affliation: string): Promise<CreateAffiliationDto>  {
   
    return plainToClass(CreateAffiliationDto, affliation, {
      excludeExtraneousValues: true,
    })
    
  }
  
  async deleteAffiliation(id: number) {
    const affilation = await this.repository.delete( id );
    return affilation;
  }

}
