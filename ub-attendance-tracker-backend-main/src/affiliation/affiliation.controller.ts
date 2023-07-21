import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { ReqContext } from '../shared/request-context/req-context.decorator';
import { RequestContext } from '../shared/request-context/request-context.dto';
import { AffiliationService } from './affiliation.service';
import { CreateAffiliationDto } from './dto/create-affiliation.dto';
import { UpdateAffiliationDTO } from './dto/update-affiliation.dto';

@ApiTags('Affiliation')
@Controller('affiliation')
export class AffiliationController {
  constructor(private readonly affiliationService: AffiliationService) {}

//  @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Affiliation List API',
  })
  async listAllAffiliation() {
    const [affiliation, count] =
      await this.affiliationService.listAffiliation();
    return { data: affiliation, meta: { count } };
  }

  //@Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Affiliation Create New API',
  })
  async createNewReason( @ReqContext() ctx: RequestContext
,  @Body() input: CreateAffiliationDto) {

    return await this.affiliationService.createNewAffiliation(ctx,input);
  }

  //@Patch(':AffId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Affiliation by id API',
  })
 
  @UseInterceptors(ClassSerializerInterceptor)
  async updateEvent(
    @Param('AffId') eventId: number,@ReqContext() ctx: RequestContext,
    @Body() input: UpdateAffiliationDTO,
  ){
    
    return {
      data: await this.affiliationService.updateAffiliation(ctx,eventId, input),
      meta: {},
    };
  }

  //@Delete(':id')
  @ApiOperation({
    summary: 'Delete Affiliation by id API',
  })
  async deleteSpace(
    @Param('id') id: number) {

    const user = await this.affiliationService.deleteAffiliation(id);
  
  }


}
