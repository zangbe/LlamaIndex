import { Module } from '@nestjs/common';
import { DocumentIndexingModule } from './document-indexing/document-indexing.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/env/.env',
    }),
    DocumentIndexingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
