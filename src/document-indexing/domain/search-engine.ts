import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CompactAndRefine,
  ContextChatEngine,
  HuggingFaceEmbedding,
  Ollama,
  QueryEngine,
  ResponseSynthesizer,
  RetrieverQueryEngine,
  Settings,
  storageContextFromDefaults,
  TextQaPrompt,
  VectorStoreIndex,
} from 'llamaindex';
import { join } from 'path';
import { promises as fs } from 'fs';
import { FileReader } from './file-reader.js';

@Injectable()
export class SearchEngine {
  #cachePath: string;
  #index: VectorStoreIndex;

  queryEngine: QueryEngine & RetrieverQueryEngine;
  chatEngine: ContextChatEngine;

  constructor(
    private readonly configService: ConfigService,
    private readonly fileReader: FileReader,
  ) {
    Settings.llm = new Ollama({
      model: 'llama3', // local
    });

    Settings.embedModel = new HuggingFaceEmbedding({
      modelType: 'BAAI/bge-small-en-v1.5',
      quantized: false,
    });

    this.#cachePath = join(
      process.cwd(),
      this.configService.get<string>('CACHE_PATH') || '',
    );
  }

  async init() {
    await this.#getIndex();
    await this.#initializedQueryEngine();
    await this.#initializedChatEngine();
    Logger.log('search-engine initialize finished');
  }

  async #getIndex() {
    const directory = await fs.readdir(this.#cachePath);
    const isEmptyCacheFolder = directory.length === 0;

    if (isEmptyCacheFolder) {
      Logger.log('initialized files..');
      await this.fileReader.cacheFile();
      Logger.log('initialized finished..');
    }

    const storageContext = await storageContextFromDefaults({
      persistDir: this.#cachePath,
    });

    this.#index = await VectorStoreIndex.init({
      storageContext: storageContext,
    });
  }

  async #initializedQueryEngine() {
    const newTextQaPrompt: TextQaPrompt = ({ context, query }) => {
      return `
        Context information is below.
        ---------------------
        ${context}
        ---------------------
        Answer the query in the style of concise and clear.
        Translate answer to Korean.
        Query: ${query}
        Answer:
      `;
    };

    const responseSynthesizer = new ResponseSynthesizer({
      responseBuilder: new CompactAndRefine(undefined, newTextQaPrompt),
    });

    this.queryEngine = this.#index.asQueryEngine({ responseSynthesizer });
  }

  async #initializedChatEngine() {
    const retriever = this.#index.asRetriever();
    this.chatEngine = new ContextChatEngine({ retriever });
  }

  async query(text: string) {
    const { message } = await this.queryEngine.query({ query: text });
    return message?.content;
  }

  async multiTurn(text: string) {
    const response = await this.chatEngine.chat({
      message: text,
      chatHistory: this.chatEngine.chatHistory,
    });

    const { message } = response;
    return message?.content;
  }
}
