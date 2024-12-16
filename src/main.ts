import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER)
  app.useLogger(logger)

  const configService = app.get(ConfigService);

  const PORT = configService.get('PORT', 3000)

  await app.listen(PORT);
}

bootstrap();
