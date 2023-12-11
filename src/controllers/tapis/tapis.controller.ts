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
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { GetTapisDto, CreateTapisDto, CreateTapisImageDto } from './tapis.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('tapis')
@UseGuards(AuthGuard)
export class TapisController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getTapis(@Query() query: GetTapisDto) {
    if (!query.size) query.size = 30;
    if (!query.page) query.page = 0;

    let conditions = {};
    /**
     * @todo search tapis
     *
     */
    if (query.search) {
      conditions = {
        ...conditions,
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
        ],
      };
    }

    const skip = query.page * query.size;
    const tapis = await this.prisma.tapis.findMany({
      take: Number(query.size),
      skip: skip,
      where: conditions,
    });

    return tapis;
  }

  @Get('/:tapisId')
  @UseGuards(AuthGuard)
  async getDetailTapis(@Param('tapisId') tapisId: string) {
    const tapis = await this.prisma.tapis.findUnique({
      where: { id: tapisId },
      include: {
        images: true,
      },
    });
    if (!tapis) throw new BadRequestException('Tapis not found');

    return tapis;
  }

  @Post()
  @UseGuards(AuthGuard)
  async createTapis(@Body() body: CreateTapisDto) {
    const [tapis] = await this.prisma.$transaction(async (tx) => {
      /**
       * @todo create tapis
       *
       */
      const tapis = await tx.tapis.create({
        data: {
          name: body.name,
          description: body.description,
          thumbnail: body.thumbnail,
        },
      });

      const tapisImages = [];
      for (const imageUrl of body.images) {
        const data: CreateTapisImageDto = {
          imageUrl: imageUrl,
          tapisId: tapis.id,
        };
        tapisImages.push(data);
      }

      /**
       * @todo create tapis images
       *
       */
      await tx.tapisImage.createMany({
        data: tapisImages,
      });

      return [tapis];
    });

    return tapis;
  }

  @Put('/:tapisId')
  @UseGuards(AuthGuard)
  async updateTapis(
    @Body() body: CreateTapisDto,
    @Param('tapisId') tapisId: string,
  ) {
    const [tapis] = await this.prisma.$transaction(async (tx) => {
      /**
       * @todo get tapis
       *
       */
      const tapis = await tx.tapis.findUnique({
        where: { id: tapisId },
      });
      if (!tapis) throw new BadRequestException('Tapis not found');

      /**
       * @todo update tapis
       *
       */
      await tx.tapis.update({
        where: { id: tapis.id },
        data: {
          name: body.name,
          description: body.description,
          thumbnail: body.thumbnail,
        },
      });

      /**
       * @todo remove existing tapis images
       *
       */
      await tx.tapisImage.deleteMany({
        where: { tapisId: tapis.id },
      });

      /**
       * @todo create tapis images
       *
       */
      const tapisImages = [];
      for (const imageUrl of body.images) {
        const data: CreateTapisImageDto = {
          imageUrl: imageUrl,
          tapisId: tapis.id,
        };
        tapisImages.push(data);
      }

      await tx.tapisImage.createMany({
        data: tapisImages,
      });

      return [tapis];
    });

    return tapis;
  }

  @Delete('/:tapisId')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteTapis(@Param('tapisId') tapisId: string) {
    await this.prisma.$transaction(async (tx) => {
      /**
       * @todo delete tapis images
       *
       */
      await tx.tapisImage.deleteMany({
        where: { tapisId: tapisId },
      });

      /**
       * @todo delete tapis
       *
       */
      await tx.tapis.delete({
        where: { id: tapisId },
      });
    });
  }
}
