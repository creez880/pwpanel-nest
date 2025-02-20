export class WelcomeEmailDto {
  to: string;
  verificationToken: string;
  username: string;
  displayName?: string;
}
