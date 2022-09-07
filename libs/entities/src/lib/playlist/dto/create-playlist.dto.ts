import { IsNotEmpty } from 'class-validator';

export class CreatePlaylistDto {
  @IsNotEmpty()
  name: string;

  description: string;

  imageUrl: string;
}
