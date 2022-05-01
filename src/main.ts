import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  //ensuring all endpoints are protected from receiving incorrect data.
  // whitelist: remove extra fields, transform: automatically transform string to int (ex: id from request)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // protection from some well-known web vulnerabilities by setting HTTP headers appropriately
  app.use(helmet());

  // all routes start with /api/v1
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || '4000';
  await app.listen(port);
}
bootstrap();
