import { User } from '@e-exam-workspace/entities';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5000,
    username: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    database: 'e-exam-db',
    entities: [User],
    synchronize: true
}