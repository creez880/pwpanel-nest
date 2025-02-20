import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { EmailConfig } from 'src/config/email.config';
import { VERIFY_MAIL_TEMPLATE_DATA } from 'src/resources/templates/verify-mail.template';
import { EmailInfoRequestDto } from './dtos/email-info-request.dto';
import { WelcomeEmailDto } from './dtos/welcome-email.dto';

@Injectable()
export class MailService {
  private readonly logger: Logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendMail(emailInfoRequest: EmailInfoRequestDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: emailInfoRequest.to,
        from: EmailConfig.emailSender,
        subject: emailInfoRequest.subject,
        text: emailInfoRequest.data,
        attachments: emailInfoRequest.attachments
      });
    } catch (error) {}
  }

  async welcomeEmail(welcomeEmailDto: WelcomeEmailDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: welcomeEmailDto.to,
        from: EmailConfig.emailSender,
        subject: EmailConfig.defaultEmailSubject,
        html: `${this.getVerifyTemplateWithUserData(welcomeEmailDto)}`
      });
    } catch (error) {
      this.logger.error(`An error occurred while sending the welcome email to ${welcomeEmailDto.to}: ${error.message}`);
      throw error;
    }
  }

  private getVerifyTemplateWithUserData(welcomeEmailDto: WelcomeEmailDto): string {
    const htmlTemplate: string = VERIFY_MAIL_TEMPLATE_DATA;
    const usernameOrDisplayname: string = welcomeEmailDto.displayName || welcomeEmailDto.username;
    return htmlTemplate.replace(':TOKEN:', welcomeEmailDto.verificationToken).replace(':USERNAME:', usernameOrDisplayname);
  }
}
