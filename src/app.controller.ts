import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';

import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('users')
  async users(@Query('since') since: number) {
    const data = await this.appService.getUsers(since);

    if (data instanceof Error)
      return new HttpException(data.message, HttpStatus.INTERNAL_SERVER_ERROR);

    return data;
  }

  @Get('users/:username/details')
  async user(@Param('username') username: string) {
    const data = await this.appService.getUser(username);

    if (data instanceof Error)
      return new HttpException(data.message, HttpStatus.INTERNAL_SERVER_ERROR);

    return data;
  }

  @Get('users/:username/repos')
  async repos(
    @Param('username') username: string,
    @Query('page') page: number,
  ) {
    const data = await this.appService.getUserRepos(username, page);

    if (data instanceof Error)
      return new HttpException(data.message, HttpStatus.INTERNAL_SERVER_ERROR);

    return data;
  }
}
