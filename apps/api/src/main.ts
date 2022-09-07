import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import connectRedis = require('connect-redis');
import { environment } from './environments/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  config();
  const configService = app.get(ConfigService);

  const RedisStore = connectRedis(session);
  const redisClient = createClient({
    url: 'redis://localhost:6379',
    legacyMode: true,
  });

  redisClient.on('error', (err) => Logger.error('Could not establish a connection with redis. ' + err, 'Redis'));
  redisClient.on('connect', () => Logger.log('Connected to redis successfully', 'Redis'));

  await redisClient.connect();

  app.use(
    session({
      store: new RedisStore({ client: redisClient as any }),
      name: environment.sessionName,
      secret: configService.getOrThrow('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 360000,
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
