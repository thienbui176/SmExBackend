import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import * as compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './Core/Exceptions/FilterExceptions';
import * as express from 'express';
import { handleValidationErrors } from './Core/Utils/ValidationError';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT ?? 3000

    app.use(compression());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            enableDebugMessages: true,
            exceptionFactory: (validationErorrs) => {
                const errors = {
                    type: 'VALIDATION',
                    ...handleValidationErrors(validationErorrs),
                };
                return new BadRequestException(errors);
            },
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
                .addBearerAuth(
                    {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        name: 'Authorization',
                        description: 'Enter JWT token',
                        in: 'header',
                    },
                    'jwt-access-token',
                )
                .build(),
        ),
    );

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.use(cookieParser());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.setGlobalPrefix('api', {
        // exclude: [{ path: 'images/:name', method: RequestMethod.GET }],
    });

    await app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

bootstrap();
