import { MailerService } from '@nestjs-modules/mailer';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import BaseService from 'src/Core/Base/BaseService';
import Messages from 'src/Core/Messages/Messages';

@Injectable()
export default class MailService extends BaseService {
    constructor(private readonly mailerService: MailerService) {
        super();
    }

    /**
     *
     * @param to
     * @param subject
     * @param html
     * @param text
     */
    public async sendMail(
        to: string,
        subject: string,
        html: string,
        text?: string,
    ): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to,
                from: 'buithien.dev@gmail.com',
                subject,
                text: text ? text : 'Welcome',
                html,
            });
            this.logger.log('Send mail to ' + to + ' success.');
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(Messages.MSG_ERROR_SYSTEM);
        }
    }
}
