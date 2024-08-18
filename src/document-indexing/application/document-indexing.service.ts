import { SearchEngine } from './../domain/search-engine.js';
import { Injectable } from '@nestjs/common';
import { TokenOptimizer } from '../domain/token-optimizer.js';

@Injectable()
export class DocumentIndexingService {
  constructor(
    private readonly searchEngine: SearchEngine,
    private readonly tokenOptimizer: TokenOptimizer,
  ) {}

  async query(text: string) {
    return await this.searchEngine.query(text);
  }

  async multiTurn(text: string) {
    const optimizedText = await this.tokenOptimizer.optimize(text);
    return await this.searchEngine.multiTurn(optimizedText);
  }
}
