import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { EmailInfoRequestDto } from './dtos/email-info-request.dto';
import { WelcomeEmailDto } from './dtos/welcome-email.dto';

@Controller('mail')
export class MailController {
  private readonly logger: Logger = new Logger(MailController.name);

  constructor(private readonly mailService: MailService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async sendMail(@Body() emailInfo: EmailInfoRequestDto) {
    try {
      return await this.mailService.sendMail(emailInfo);
    } catch (error) {
      this.logger.error(`An error occurred while sending the email: ${error.message}`);
      throw error;
    }
  }

  @Post('welcome')
  @HttpCode(HttpStatus.CREATED)
  async sendWelcomeMail(@Body() welcomeEmailDto: WelcomeEmailDto) {
    try {
      return await this.mailService.welcomeEmail(welcomeEmailDto);
    } catch (error) {
      this.logger.error(`An error occurred while sending the email: ${error.message}`);
      throw error;
    }
  }
}
