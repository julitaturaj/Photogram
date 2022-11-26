import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sendGridMail from '@sendgrid/mail';

interface MailBody {
  from: string;
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private mailer;
  constructor(private readonly configService: ConfigService) {
    const sendGridApiKey = this.configService.get('sendGridApiKey');
    this.mailer = sendGridMail;
    this.mailer.setApiKey(sendGridApiKey);
  }

  async sendMail(mailBody: MailBody) {
    try {
      await this.mailer.send(mailBody);
      console.log('Test email sent successfully');
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
}
