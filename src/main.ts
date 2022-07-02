import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET',
    allowedHeaders: 'Content-Type, Authorization',
  });
  await app.listen(process.env.PORT || 5000, '0.0.0.0');
}
bootstrap();
