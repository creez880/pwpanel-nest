import { Transform } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, MaxLength, ValidateIf } from 'class-validator';

export class EmailInfoRequestDto {
  @IsNotEmpty({ message: 'Email recipient is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  to: string;

  @IsNotEmpty({ message: 'Email subject is required' })
  @MaxLength(255, { message: 'Email subject cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim())
  subject: string;

  @IsNotEmpty({ message: 'Email body is required' })
  @Transform(({ value }) => value?.trim())
  data: string;

  @ValidateIf((object) => object.attachments !== undefined)
  @IsArray({ message: 'Attachments must be an array' })
  attachments?: any[];
}
