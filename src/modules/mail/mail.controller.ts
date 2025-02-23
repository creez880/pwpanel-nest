import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { EmailInfoRequestDto } from './dtos/email-info-request.dto';
import { WelcomeEmailDto } from './dtos/welcome-email.dto';
import { MailService } from './mail.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('mail')
export class MailController {
  private readonly logger: Logger = new Logger(MailController.name);

  constructor(private readonly mailService: MailService) {}

  @ApiOperation({
    summary: 'Send an email',
    description: 'Sends an email to the specified recipient with the given subject and message body. Supports optional attachments.'
  })
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
  @ApiOperation({
    summary: 'Send a welcome email with verification link',
    description:
      "Sends a welcome email to a newly registered user. The email contains a verification link with a token to confirm the user's email address."
  })
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
