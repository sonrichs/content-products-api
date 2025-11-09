import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { VersioningType } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Content Products API')
    .setDescription('The Content Products API description')
    .setVersion('1.0')
    .addTag('Resources')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
    operationIdFactory: (controllerType: string, methodType: string) =>
      methodType,
  };
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api/docs', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
