export class GetAreaDto {
  page?: number;
  size?: number;
}

export class CreateAreaDto {
  storeName: string;
  longitude: number;
  latitude: number;
}
