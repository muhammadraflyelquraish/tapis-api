import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateAreaDto, GetAreaDto } from './area.dto';
import { PrismaService } from 'src/services/prisma.service';

@Controller('area')
export class AreaController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getArea(@Query() query: GetAreaDto) {
    if (!query.size) query.size = 30;
    if (!query.page) query.page = 0;

    const skip = query.page * query.size;
    const tapisArea = await this.prisma.tapisArea.findMany({
      take: Number(query.size),
      skip: skip,
    });

    return tapisArea;
  }

  @Get('/:areaId')
  async getDetailTapis(@Param('areaId') areaId: string) {
    const area = await this.prisma.tapisArea.findUnique({
      where: { id: areaId },
    });
    if (!area) throw new BadRequestException('Area not found');

    return area;
  }

  @Post()
  async createArea(@Body() body: CreateAreaDto) {
    /**
     * @todo create area
     *
     */
    const area = await this.prisma.tapisArea.create({
      data: {
        storeName: body.storeName,
        longitude: body.longitude,
        latitude: body.latitude,
      },
    });

    return area;
  }

  @Put('/:areaId')
  async editArea(@Param('areaId') areaId: string, @Body() body: CreateAreaDto) {
    /**
     * @todo edit area
     *
     */
    const area = await this.prisma.tapisArea.update({
      where: { id: areaId },
      data: {
        storeName: body.storeName,
        longitude: body.longitude,
        latitude: body.latitude,
      },
    });

    return area;
  }

  @Delete('/:areaId')
  @HttpCode(204)
  async deleteArea(@Param('areaId') areaId: string) {
    /**
     * @todo delete area
     *
     */
    await this.prisma.tapisArea.delete({
      where: { id: areaId },
    });
  }
}
