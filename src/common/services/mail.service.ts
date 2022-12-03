import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sendGridMail from '@sendgrid/mail';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

interface MailBody {
  from: string;
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private mailer;
  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    const sendGridApiKey = this.configService.get('sendGridApiKey');
    this.mailer = sendGridMail;
    this.mailer.setApiKey(sendGridApiKey);
  }

  async sendMail(mailBody: MailBody) {
    try {
      await this.mailer.send(mailBody);
      this.logger.info('Email sent succesfully. Recepient: ' + mailBody.to);
    } catch (error) {
      if (error.response) {
        this.logger.error(error.response.body + '. Recepient: ' + mailBody.to);
      } else {
        this.logger.error('Email not sent. Recepient: ' + mailBody.to);
      }
      throw error;
    }
  }
}
