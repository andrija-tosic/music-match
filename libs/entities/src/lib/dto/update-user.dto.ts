import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, MinLength } from 'class-validator'

export class UpdateUserDto extends CreateUserDto {
}