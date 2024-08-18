import { SentenceSplitter } from 'llamaindex';
import { translate, TranslationResult, MET } from 'bing-translate-api';
import { BadRequestException, Injectable } from '@nestjs/common';
import nlp from 'compromise';
import { removeStopwords, eng } from 'stopword';
import Three from 'compromise/view/three';

@Injectable()
export class TokenOptimizer {
  // 문장부호 정규식
  #punctuationRegex: RegExp;

  #stopWords: string[];

  #maxTokens: number = 30;

  constructor() {
    this.#punctuationRegex = /[.,?!]/g;
    const questionWords = [
      'what',
      'which',
      'who',
      'whom',
      'where',
      'when',
      'why',
      'how',
    ];

    const modalVerbs = [
      'can',
      'could',
      'may',
      'might',
      'will',
      'would',
      'shall',
      'should',
      'must',
    ];

    this.#stopWords = eng.filter(
      (stopWord) =>
        !questionWords.concat(modalVerbs).includes(stopWord.toLowerCase()),
    );
  }

  async optimize(text: string) {
    if (!text) throw new BadRequestException('There is no text to optimize.');

    if (!this.#isTokenLimitExceeded(text)) return text;

    const translatedText = this.#isContainsKorean(text)
      ? await this.#translateToEnglish(text)
      : text;

    const { nlpText, normalize } = this.#nomalizedText(translatedText);

    const removedStopWords = this.#removeStopWords(normalize);

    return this.#optimizeText(removedStopWords, nlpText);
  }

  #isTokenLimitExceeded(text: string) {
    const splitter = new SentenceSplitter();
    const tokens = splitter.tokenSize(text);
    return this.#maxTokens < tokens;
  }

  #isContainsKorean(text: string) {
    const koreanRegex = /[가-힣]/;
    return koreanRegex.test(text);
  }

  async #translateToEnglish(text: string) {
    const { translation } =
      (await translate(text, 'auto-detect', 'en')) || <TranslationResult>{};

    return translation;
  }

  #nomalizedText(text: string) {
    const nlpText = nlp(text);
    const normalize = nlpText.normalize().text();
    return { nlpText, normalize: normalize.split(' ') };
  }

  #removeStopWords(text: string[]) {
    return removeStopwords(text, this.#stopWords);
  }

  #optimizeText(text: string[], nlpText: Three) {
    const adjectives = nlpText.adjectives().text()?.split(' ');
    const adverbs = nlpText.adverbs().text()?.split(' ');
    const wordsToRemove = adjectives.concat(adverbs);

    const optimizedText = text
      .filter(
        (word) =>
          !wordsToRemove.includes(word.replace(this.#punctuationRegex, '')),
      )
      .join(' ');

    return optimizedText;
  }
}
