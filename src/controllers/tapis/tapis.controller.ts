import axios from 'axios';
import { Express } from 'express';
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
  UploadedFile,
  UseInterceptors,
  // UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { GetTapisDto, CreateTapisDto, CreateTapisImageDto } from './tapis.dto';
import { FileInterceptor } from '@nestjs/platform-express';
// import { AuthGuard } from 'src/guards/auth.guard';
import { Tapis } from '@prisma/client';

@Controller('tapis')
// @UseGuards(AuthGuard)
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
          { utility: { contains: query.search, mode: 'insensitive' } },
          { signification: { contains: query.search, mode: 'insensitive' } },
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
  // @UseGuards(AuthGuard)
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
  // @UseGuards(AuthGuard)
  async createTapis(@Body() body: CreateTapisDto) {
    const [tapis] = await this.prisma.$transaction(async (tx) => {
      /**
       * @todo create tapis
       *
       */
      const tapis = await tx.tapis.create({
        data: {
          name: body.name,
          utility: body.utility,
          signification: body.signification,
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
  // @UseGuards(AuthGuard)
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
          utility: body.utility,
          signification: body.signification,
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
  // @UseGuards(AuthGuard)
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

  @Post('/scan')
  @UseInterceptors(FileInterceptor('image'))
  async scanTapis(@UploadedFile() file: Express.Multer.File) {
    /**
     * @todo: to base64 image
     *
     */
    const base64Image = file.buffer.toString('base64');

    // /**
    //  * @todo: predict image
    //  *
    //  */
    const url = process.env.TAPIS_DETECTION_API + '/scan/';
    const modelPredict = await axios.post(url, {
      model_url: process.env.MODEL_URL,
      base64: base64Image,
    });

    if (!modelPredict) {
      throw new BadRequestException('Image not supported');
    }

    /**
     * @todo: load existing tapis info
     *
     */
    let tapis: Tapis[];
    const tapisName = modelPredict.data.predict;
    if (tapisName) {
      tapis = await this.prisma.tapis.findMany({
        where: {
          name: {
            contains: tapisName,
            mode: 'insensitive',
          },
        },
      });
    }
    return {
      tapisId: tapis.length > 0 ? tapis[0].id : '',
      tapisName: tapisName,
      tapisImage: tapis.length > 0 ? tapis[0].thumbnail : '',
    };
  }
}
