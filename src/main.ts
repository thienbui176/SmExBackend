import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './Core/Exceptions/FilterExceptions';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    SwaggerModule.setup('/api', app, () =>
        SwaggerModule.createDocument(
            app,
            new DocumentBuilder()
                .setTitle('SmEx Backend API')
                .setDescription('Api sample for backend SmEx')
                .setVersion('1.0')
                .addTag('SmEx API')
                .build(),
        ),
    );

    app.use(compression());
    await app.listen(process.env.PORT ?? 3000, () => {
        console.log(`Server running on port ${3000}`);
    });
}

bootstrap();
