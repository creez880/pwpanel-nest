export class EmailInfoRequestDto {
  to: string;
  subject: string;
  data: string;
  attachments?: any[];
}
