import { Module } from '@nestjs/common';
import MailService from './MailService';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const email = configService.getOrThrow('MAILER_EMAIL');
                const password = configService.getOrThrow(
                    'MAILER_EMAIL_PASSWORD',
                );
                const transport =
                    'smtps://' + email + ':' + password + '@smtp.gmail.com';
                const name = '';
                return {
                    transport,
                    defaults: {
                        from: '"' + name + "'" + ' ' + '<' + email + '>"',
                    },
                    template: {
                        dir: __dirname + '/templates',
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                };
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService, MailerModule],
})
export default class MailModule {}
