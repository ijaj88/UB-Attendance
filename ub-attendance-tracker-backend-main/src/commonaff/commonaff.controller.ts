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
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PatchAffiliation } from 'src/affiliation/dto/update-patch-affiliation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { CreateAffiliationDto} from '../affiliation/dto/create-affiliation.dto';
import { UpdateAffiliationDTO } from '../affiliation/dto/update-affiliation.dto';
import { ReqContext } from '../shared/request-context/req-context.decorator';
import { RequestContext } from '../shared/request-context/request-context.dto';
import { CommonAffService } from './commonaff.service';

@ApiTags('Common Affiliation')
@Controller('CommonAffService')
export class CommonAffController {
  constructor(private readonly CommonAffService: CommonAffService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Affiliation List API',
  })
  async listAllAffiliation() {
    const [affiliation, count] =
      await this.CommonAffService.listAffiliation();
    return { data: affiliation, meta: { count } };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Affiliation Create New API',
  })
  async createNewReason( @ReqContext() ctx: RequestContext
,  @Body() input: CreateAffiliationDto) {
    console.log(input);
    return await this.CommonAffService.createNewAffiliation(ctx,input);
  }
  @Patch(':AffId')
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
      data: await this.CommonAffService.updateAffiliation(ctx,eventId, input),
      meta: {},
    };
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Affiliation by id API',
  })
  async deleteSpace(
    @Param('id') id: number,@ReqContext() ctx: RequestContext) 
    {

    const user = await this.CommonAffService.deleteAffiliation(ctx,id);
    return user
  
  }

  @Post('patchAffiliation')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Affiliation Patch list New API',
  })
  async PatchAffiliation( @ReqContext() ctx: RequestContext
,  @Body() input: PatchAffiliation) {
    console.log(input);
    return await this.CommonAffService.PatchNewAffiliation(ctx,input);
  }


}
