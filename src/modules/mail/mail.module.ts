import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailConfig } from 'src/config/email.config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: EmailConfig.emailHost,
        auth: {
          user: EmailConfig.emailUser,
          pass: EmailConfig.emailPassword
        }
      }
    })
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
