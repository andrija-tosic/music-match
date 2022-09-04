import { SetMetadata } from '@nestjs/common';
import { Roles as RoleEnum } from '@music-match/entities';

export const Role = (role: RoleEnum) => SetMetadata('role', role);
