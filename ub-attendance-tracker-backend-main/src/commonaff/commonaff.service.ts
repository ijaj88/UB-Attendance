import { Injectable,  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AffiliationService } from 'src/affiliation/affiliation.service';
import { UpdateAffiliationDTO } from 'src/affiliation/dto/update-affiliation.dto';
import { PatchAffiliation } from 'src/affiliation/dto/update-patch-affiliation.dto';
import { Affiliation } from 'src/affiliation/entities/affiliation.entity';
import { AffiliationToUser } from 'src/affiliation/entities/affiliation_to_user.entity';
import { AffiliationRepository } from 'src/affiliation/repositories/affiliation.repository';
import { AffiliationToUserRepository } from 'src/affiliation/repositories/affiliation-user.repository';
import { Action } from 'src/shared/acl/action.constant';
import { UserService } from 'src/user/services/user.service';

import { CreateAffiliationDto} from '../affiliation/dto/create-affiliation.dto';
import { ReqContext } from '../shared/request-context/req-context.decorator';
import { RequestContext } from '../shared/request-context/request-context.dto';
import {AffiliationAclService} from './commonaff-acl.service'


@Injectable()
export class CommonAffService {
  constructor(
    private readonly AffiliationService: AffiliationService,
    private readonly AffiliationRepository: AffiliationRepository,
    private readonly UserService: UserService,
    private readonly AffiliationToUserRepository: AffiliationToUserRepository,
    private readonly AffiliationAclService: AffiliationAclService
    ) {}
    async listAffiliation() {
      return await this.AffiliationRepository.findAndCount({
        where: {
          isActive: true,
        },
      }); 
       }
    async createNewAffiliation(ctx: RequestContext,input: CreateAffiliationDto) {
      const affiliation = plainToClass(Affiliation, input);
      affiliation.isActive = true;
//      affiliation.userId = ctx.user.id;
 //     const user = await this.UserService.findByIdInternal(ctx, ctx.user.id);
//      affiliation.user = [user];
      console.log(affiliation);

      const aff = plainToClass(AffiliationToUser, input);
  //    aff.user= user;
  if (!this.AffiliationAclService.forActor(ctx.user).canDoAction(Action.Create)) {
    throw new UnauthorizedException();
  }
    
    
       const saved = await this.AffiliationRepository.save(affiliation);
//       aff.affiliation= saved;
//       await this.AffiliationToUserRepository.save(aff)

      return saved
    }
    async updateAffiliation(ctx: RequestContext,id: number, input: UpdateAffiliationDTO) {
      const affilation = await this.AffiliationRepository.findOne({ where: { id } });

      if (!this.AffiliationAclService.forActor(ctx.user).canDoAction(Action.Update)) {
        throw new UnauthorizedException();
      }
  
      const updatedAff: Affiliation = {
        ...affilation,
        ...plainToClass(Affiliation, input),
      };
      const updateResult = await this.AffiliationRepository.save(updatedAff);

      return updateResult;
    }
      
  async deleteAffiliation(ctx: RequestContext,id: number) {

    const affiliationToUserIds = await this.AffiliationToUserRepository
    .createQueryBuilder('affiliation_to_user')
    .select('affiliation_to_user.affiliation_to_userId')
    .where('affiliation_to_user.affiliation = :afiliationId', { afiliationId: id  })
    .getOne();
    console.log(affiliationToUserIds,id)
    if (!this.AffiliationAclService.forActor(ctx.user).canDoAction(Action.Delete)) {
      throw new UnauthorizedException();
    }

    if(!affiliationToUserIds){
//      throw new Error("not implemented")

      const affilation = await this.AffiliationRepository.delete( id );
      return 'Affiliation Deleted';
      
    }
    else {
      const affilation = await this.AffiliationRepository.findOne( {where: {id}} );
      if(!affilation)
      {
        throw new Error('Affiliation not found')
      }
      affilation.isActive = false
      await this.AffiliationRepository.save(affilation)
      return 'Affiliation isDisabled'

    }
  }


    async PatchNewAffiliation(ctx: RequestContext, input: PatchAffiliation) {

      const affilations: Affiliation[] = [];
      const Affnew : Affiliation[] = [];


      
      const affiliationToUserIds = await this.AffiliationToUserRepository
          .createQueryBuilder('affiliation_to_user')
          .select('affiliation_to_user.affiliation_to_userId')
          .where('affiliation_to_user.user = :userId', { userId: ctx.user.id  })
          .getMany();

      if (affiliationToUserIds)
      {
        for (const data of affiliationToUserIds) {

      const a1= await this.AffiliationToUserRepository.delete(data.affiliation_to_userId);
        console.log(a1)    
        
        }
      }

      for (const affilation of input.affilations) {

        const aff = plainToClass(AffiliationToUser, input);
  
        const user = await this.UserService.findByIdInternal(ctx, ctx.user.id);
  
        aff.user= user;
  
        const affilationObj = await this.AffiliationRepository.findOne({ where: { id: affilation } });
        aff.affiliation= affilationObj;
      
        if(affilationObj){
         await this.AffiliationToUserRepository.save(aff)
        }
      }
        
    console.log(affiliationToUserIds);





    }
}
