import { Test, TestingModule } from '@nestjs/testing';
import { TapisController } from './tapis.controller';

describe('TapisController', () => {
  let controller: TapisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TapisController],
    }).compile();

    controller = module.get<TapisController>(TapisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
