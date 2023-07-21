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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { CreateReasonInput } from './dto/create-reason.dto';
import { UpdateReasonInput } from './dto/update-reason.dto';
import { ReasonsService } from './reasons.service';

@ApiTags('Reasons')
@Controller('reasons')
export class ReasonsController {
  constructor(private readonly reasonsService: ReasonsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Reasons List API',
  })
  async listAllReasons() {
    const [reasons, count] = await this.reasonsService.listReasons();
    return { data: reasons, meta: { count } };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Reasons Create New API',
  })
  async createNewReason(@Body() input: CreateReasonInput) {
    return await this.reasonsService.createNewReason(input);
  }

  @Patch(':reasonId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Update Reason by id API',
  })
 
  @UseInterceptors(ClassSerializerInterceptor)
  async updateEvent(
    @Param('reasonId') eventId: number,
    @Body() input: UpdateReasonInput,
  ){
    
    return {
      data: await this.reasonsService.updateReason(eventId, input),
      meta: {},
    };
  }

/*  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Delete Reason by id API',
  })
  async deleteSpace(
    @Param('id') id: number) {

    const user = await this.reasonsService.deleteReason(id);
  
  }*/
}
