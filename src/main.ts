import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import { sessionMiddleware } from './auth/session.middleware';
import { json as expressJson, urlencoded as expressUrlEncoded } from 'express';
import { AuthenticatedGuard } from './auth/local.guard';
const corsOptions: CorsOptions = {
  origin: ['http://localhost:3000', 'https://localhost:3000'],
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableCors(corsOptions);
  app.use(sessionMiddleware(configService));
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalGuards(new AuthenticatedGuard());
  app.use(expressJson({ limit: '100mb' }));
  app.use(expressUrlEncoded({ limit: '100mb', extended: true }));

  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
