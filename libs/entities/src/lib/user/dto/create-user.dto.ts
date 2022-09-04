import { isNotEmpty, IsNotEmpty, MinLength } from 'class-validator';
import { Roles } from '../roles';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  role: Roles;
}
