import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './all-exceptions-filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Photogram')
    .setDescription('Photogram API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalFilters(new AllExceptionsFilter());

  SwaggerModule.setup('', app, document);
  const port = app.get(ConfigService).get('app.port');
  await app.listen(port);
}
bootstrap();
