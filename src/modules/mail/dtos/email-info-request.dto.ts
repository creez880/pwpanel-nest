import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, MaxLength, ValidateIf } from 'class-validator';

export class EmailInfoRequestDto {
  @IsNotEmpty({ message: 'Email recipient is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  @ApiProperty({ type: String, required: true, maxLength: 255, description: 'Email recipient', example: 'some.name@domain.com' })
  to: string;

  @IsNotEmpty({ message: 'Email subject is required' })
  @MaxLength(255, { message: 'Email subject cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ type: String, required: true, maxLength: 255, description: 'Email subject' })
  subject: string;

  @IsNotEmpty({ message: 'Email body is required' })
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ type: String, required: true, description: 'Email body' })
  data: string;

  @ValidateIf((object) => object.attachments !== undefined)
  @IsArray({ message: 'Attachments must be an array' })
  @ApiProperty({ required: false, description: 'Email attachments' })
  attachments?: any[];
}
