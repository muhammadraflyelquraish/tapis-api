export class GetTapisDto {
  search?: string;
  page?: number;
  size?: number;
}

export class CreateTapisDto {
  name: string;
  utility: string;
  signification: string;
  description: string;
  thumbnail: string;
  images: Array<string>;
}

export class CreateTapisImageDto {
  imageUrl: string;
  tapisId: string;
}
