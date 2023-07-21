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

import { CreateEventInput } from './dto/create-event.dto';
import { EventOutput } from './dto/create-event-output';
import { CreateEventSeries } from './dto/create-eventSeries.dto';
import { EventStatParam, EventStatQuery } from './dto/event-stats.dto';
import { MarkEventAttendanceInput } from './dto/mark-attendance.dto';
import { UpdateEventInput } from './dto/update-event.dto';
import { DisableEventSpace } from './dto/update-event.dto';
import { Events } from './entities/event.entity';
import { EventsService } from './events.service';

@ApiTags('Event')
@Controller('event')
export class EventsController {
  constructor(
    private readonly eventService: EventsService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(EventsController.name);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('history')
  async getUserEventHistory(@ReqContext() ctx: RequestContext): Promise<any> {
    this.logger.log(ctx, `${this.getUserEventHistory.name} was called`);

    const user = await this.eventService.getUserEventHistory(ctx);
    return { data: user, meta: {} };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('series')
  async getEventSeries(@ReqContext() ctx: RequestContext): Promise<any> {
    this.logger.log(ctx, `${this.getEventSeries.name} was called`);

    const eventSeries = await this.eventService.listAllEventSeries();
    return { data: eventSeries, meta: {} };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('stats')
  async listAllStats(@ReqContext() ctx: RequestContext): Promise<any> {
    this.logger.log(ctx, `${this.getEventSeries.name} was called`);

    const stats = await this.eventService.listAllEventStats();
    return { data: stats, meta: {} };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('event-stats/:id')
  async getEventStats(
    @ReqContext() ctx: RequestContext,
    @Query() query: EventStatQuery,
    @Param() stat: EventStatParam,
  ): Promise<any> {
    this.logger.log(ctx, `${this.getEventSeries.name} was called`);
    const stats = await this.eventService.executeQuery(stat.id, query, ctx);
    return { data: stats, meta: {} };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('series')
  async createNewSeries(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateEventSeries,
  ): Promise<any> {
    this.logger.log(ctx, `${this.getEventSeries.name} was called`);

    const eventSeries = await this.eventService.createNewSeries(input, ctx);
    return { data: eventSeries, meta: {} };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({
    summary: 'Get events as a list API',
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

    const { events, count } = await this.eventService.getEvents(
      ctx,
      query.limit,
      query.offset,
    );

    return { data: events, meta: { count } };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('create')
  @ApiOperation({
    summary: 'Event API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(EventOutput),
  })
  async createEvent(
    @Body() input: CreateEventInput,
    @ReqContext() ctx: RequestContext,
  ) {
    const createdEvent = await this.eventService.createEvent(ctx, input);
    return { data: createdEvent, meta: {} };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({
    summary: 'Get event by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(EventOutput),
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
  ): Promise<BaseApiResponse<Events>> {
    this.logger.log(ctx, `${this.getEvent.name} was called`);

    const user = await this.eventService.getEventById(ctx, id);
    return { data: user, meta: {} };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':eventId/action/:action')
  @ApiOperation({
    summary: 'Get event by id API',
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
    @Param() input: MarkEventAttendanceInput,
    @ReqContext() ctx: RequestContext,
  ) {
    return {
      data: await this.eventService.markAttendance(ctx, input),
      meta: {},
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':eventId')
  @ApiOperation({
    summary: 'Update Event API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(EventOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async updateEvent(
    @ReqContext() ctx: RequestContext,
    @Param('eventId') eventId: number,
    @Body() input: UpdateEventInput,
  ): Promise<any> {
    this.logger.log(ctx, `${this.updateEvent.name} was called`);

    return {
      data: await this.eventService.updateEvent(eventId, input, ctx),
      meta: {},
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete event  by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    //type: SwaggerBaseApiResponse(EventOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  async deleteEvent(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<BaseApiResponse<Events>> {
    this.logger.log(ctx, `${this.getEvent.name} was called`);

    const evid = await this.eventService.deleteEventById(ctx, id);
    // showing the event deleted from the database
    return { data: evid, meta: {} };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/DeleteSpace/:id')
  @ApiOperation({
    summary: 'Delete Space  by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    //type: SwaggerBaseApiResponse(EventOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  async deleteSpace(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<any> {
    this.logger.log(ctx, `${this.getEvent.name} was called`);

    const evid = await this.eventService.deleteSpaceById(ctx, id);
    // showing the event deleted from the database
    return { data: evid, meta: {} };
  }


  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/DeleteReason/:id')
  @ApiOperation({
    summary: 'Delete Reason  by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    //type: SwaggerBaseApiResponse(EventOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  async deleteReason(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<any> {
    this.logger.log(ctx, `${this.getEvent.name} was called`);

    const evid = await this.eventService.deleteReasonById(ctx, id);
    // showing the event deleted from the database
    return { data: evid, meta: {} };
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/DisableEvent/Event/:id')
  @ApiOperation({
    summary: 'Delete Reason  by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    //type: SwaggerBaseApiResponse(EventOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  async disableEvent(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
    @Body() input: DisableEventSpace
  ): Promise<any> {
    this.logger.log(ctx, `${this.getEvent.name} was called`);

    const evid = await this.eventService.disableEvent(ctx, id,input);
    // showing the event deleted from the database
    return { data: evid, meta: {} };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/DisableSpace/Space/:id')
  @ApiOperation({
    summary: 'Delete Reason  by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    //type: SwaggerBaseApiResponse(EventOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  async disableSpace(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
    @Body() input: DisableEventSpace
  ): Promise<any> {
    this.logger.log(ctx, `${this.getEvent.name} was called`);

    const evid = await this.eventService.disableSpace(ctx, id,input);
    // showing the event deleted from the database
    return { data: evid, meta: {} };
  }
  // async getAllEvents() {}
}
