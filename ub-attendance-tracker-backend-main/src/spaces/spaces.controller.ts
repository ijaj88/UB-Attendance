import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from 'src/shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { AppLogger } from 'src/shared/logger/logger.service';
import { ReqContext } from 'src/shared/request-context/req-context.decorator';
import { RequestContext } from 'src/shared/request-context/request-context.dto';

import { CreateSpaceInput } from './dto/create-space.dto';
import { SpaceOutput } from './dto/create-space-output';
import {
  MarkSpaceAttendanceInput,
  UpdateSpaceAttendanceReason,
} from './dto/mark-attendance.dto';
import { UpdateSpaceInput } from './dto/update-space.dto';
import { Spaces } from './entities/space.entity';
import { SpacesService } from './spaces.service';

@ApiTags('Space')
@Controller('space')
export class SpacesController {
  constructor(
    private readonly spaceService: SpacesService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(SpacesController.name);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('create')
  @ApiOperation({
    summary: 'Space API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(SpaceOutput),
  })
  async createEvent(
    @Body() input: CreateSpaceInput,
    @ReqContext() ctx: RequestContext,
  ) {
    const createdEvent = await this.spaceService.createSpace(ctx, input);
    return { data: createdEvent, meta: {} };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({
    summary: 'Get space by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(SpaceOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  async getEvent(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<BaseApiResponse<Spaces>> {
    this.logger.log(ctx, `${this.getEvent.name} was called`);

    const user = await this.spaceService.getSpaceById(ctx, id);
    return { data: user, meta: {} };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({
    summary: 'Get spaces as a list API',
  })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: SwaggerBaseApiResponse([UserOutput]),
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   type: BaseApiErrorResponse,
  // })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  // @Roles(ROLE.ADMIN, ROLE.USER)
  async getEvents(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ) {
    this.logger.log(ctx, `${this.getEvents.name} was called`);

    const { spaces, count } = await this.spaceService.listAllSpaces(
      ctx,
      query.limit,
      query.offset,
    );

    return { data: spaces, meta: { count } };
  }
  /*
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete space by id API',
  })
  async deleteSpace(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<any> {
    this.logger.log(ctx, `${this.getEvent.name} was called`);

    const user = await this.spaceService.deleteSpace(ctx, id);
    return { data: user };
  }*/
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  @ApiOperation({
    summary: 'Restore space by id API',
  })
  async RestoreSpace(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<any> {
    this.logger.log(ctx, `${this.getEvent.name} was called`);
    const user = await this.spaceService.restoreSpace(ctx, id);
    return { data: user };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':spaceId')
  @ApiOperation({
    summary: 'Update Space API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UpdateSpaceInput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async updateEvent(
    @ReqContext() ctx: RequestContext,
    @Param('spaceId') eventId: number,
    @Body() input: UpdateSpaceInput,
  ): Promise<any> {
    this.logger.log(ctx, `${this.updateEvent.name} was called`);

    return {
      data: await this.spaceService.updateSpace(eventId, input, ctx),
      meta: {},
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('attendance/:spaceId')
  @ApiOperation({
    summary: 'Mark Space Attendance API',
  })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: SwaggerBaseApiResponse(EventOutput),
  // })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  async markAttendance(
    @Param() input: MarkSpaceAttendanceInput,
    @ReqContext() ctx: RequestContext,
  ) {
    return {
      data: await this.spaceService.markAttendance(ctx, input),
      meta: {},
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('attendance/reason')
  @ApiOperation({
    summary: 'Update Space Attendance Reason API',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  async updateAttendanceReason(
    @Body() input: UpdateSpaceAttendanceReason,
    @ReqContext() ctx: RequestContext,
  ) {
    return {
      data: await this.spaceService.updateSpaceAttendance(ctx, input),
      meta: {},
    };
  }
}
