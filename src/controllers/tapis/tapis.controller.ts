import { Controller, Get } from '@nestjs/common';

@Controller('tapis')
export class TapisController {
  constructor() {}

  @Get()
  async getTapis() {
    return {
      message: 'list of tapis',
    };
  }
}
