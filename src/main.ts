import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { SearchEngine } from './document-indexing/domain/search-engine.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('llama-index')
    .setVersion('1.0')
    .addTag('llamaindex')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const searchEngine = app.get<SearchEngine>(SearchEngine);
  await searchEngine.init();

  await app.listen(3000);
}
bootstrap();
