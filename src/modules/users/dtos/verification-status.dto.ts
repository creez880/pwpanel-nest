export class UserVerificationStatusDto {
  userId: number;
  isVerified: boolean;
  emailVerificationToken?: string | null;
  emailVerificationExpiresAt?: Date | null;
}
