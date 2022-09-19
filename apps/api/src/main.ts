import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as connectRedis from 'connect-redis';
import { environment } from './environments/environment';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: 'http://localhost:4200',
    },
  });
  app.useGlobalPipes(new ValidationPipe());

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  config();
  const configService = app.get(ConfigService);

  const RedisStore = connectRedis(session);
  const redisClient = createClient({
    url: `redis://${environment.redisHost}:6379`,
    legacyMode: true,
  });

  redisClient.on('error', (err) =>
    Logger.error('Could not establish a connection with redis. ' + err, 'Redis')
  );
  redisClient.on('connect', () =>
    Logger.log('Connected to redis successfully', 'Redis')
  );

  await redisClient.connect();

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      name: environment.sessionName,
      secret: configService.getOrThrow('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const port = process.env.PORT || environment.port;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
