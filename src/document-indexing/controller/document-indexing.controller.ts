import { Body, Controller, Post } from '@nestjs/common';
import { DocumentIndexingService } from '../application/document-indexing.service.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryDocumentDto } from '../application/dto/query-document.dto.js';

@ApiTags('document')
@Controller({
  path: 'document',
})
export class DocumentIndexingController {
  constructor(private readonly service: DocumentIndexingService) {}

  @Post('/query')
  @ApiOperation({
    summary: 'Query the query engine and get a response.',
    description:
      'A query engine that uses a retriever to query an index and then synthesizes the response.',
  })
  @ApiResponse({ status: 201, type: String })
  async query(@Body() dto: QueryDocumentDto) {
    return this.service.query(dto.text);
  }

  @Post('/multi-turn')
  @ApiOperation({
    summary: `Send message along with the class's current chat history to the LLM.`,
    description:
      'ContextChatEngine uses the Index to get the appropriate context for each query',
  })
  @ApiResponse({ status: 201, type: String })
  async chat(@Body() dto: QueryDocumentDto) {
    return this.service.multiTurn(dto.text);
  }
}
