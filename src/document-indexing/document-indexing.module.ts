import { SearchEngine } from './domain/search-engine.js';
import { Module } from '@nestjs/common';
import { DocumentIndexingController } from './controller/document-indexing.controller.js';
import { DocumentIndexingService } from './application/document-indexing.service.js';
import { FileReader } from './domain/file-reader.js';
import { TokenOptimizer } from './domain/token-optimizer.js';

@Module({
  imports: [],
  controllers: [DocumentIndexingController],
  providers: [
    DocumentIndexingService,
    FileReader,
    SearchEngine,
    TokenOptimizer,
  ],
})
export class DocumentIndexingModule {}
