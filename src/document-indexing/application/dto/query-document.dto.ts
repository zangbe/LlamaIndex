import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class QueryDocumentDto {
  @ApiProperty({
    required: true,
    nullable: false,
    example: 'x-api-tran-id에 대해 알려주세요.',
    type: String,
  })
  @IsNotEmpty()
  public text: string;
}
