import { Injectable } from '@nestjs/common';
import {
  PDFReader,
  storageContextFromDefaults,
  VectorStoreIndex,
} from 'llamaindex';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileReader {
  #cachePath: string;
  #filePath1: string;
  #filePath2: string;

  constructor(private readonly configService: ConfigService) {
    this.#cachePath = join(
      process.cwd(),
      this.configService.get<string>('CACHE_PATH') || '',
    );
    this.#filePath1 = join(
      process.cwd(),
      this.configService.get<string>('FILE_PATH') || '',
      this.configService.get<string>('FILE_NAME_1') || '',
    );
    this.#filePath2 = join(
      process.cwd(),
      this.configService.get<string>('FILE_PATH') || '',
      this.configService.get<string>('FILE_NAME_2') || '',
    );
  }

  async cacheFile() {
    const reader = new PDFReader();

    const [file1, file2] = await Promise.all([
      reader.loadData(this.#filePath1),
      reader.loadData(this.#filePath2),
    ]);

    const combinedFiles = file1.concat(file2);

    const storageContext = await storageContextFromDefaults({
      persistDir: this.#cachePath,
    });

    await VectorStoreIndex.fromDocuments(combinedFiles, {
      storageContext,
    });
  }
}
