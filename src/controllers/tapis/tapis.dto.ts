export class GetTapisDto {
  search?: string;
  page?: number;
  size?: number;
}

export class CreateTapisDto {
  name: string;
  description: string;
  thumbnail: string;
  images: Array<string>;
}

export class CreateTapisImageDto {
  imageUrl: string;
  tapisId: string;
}
