import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  async getHello() {
    return {
      message: 'Hello folks, welcome to API DEKAT (Deteksi Kain Tapis)',
      version: 1,
    };
  }
}
