import { SentenceSplitter } from 'llamaindex';
import { TokenOptimizer } from '../domain/token-optimizer';
import { Test } from '@nestjs/testing';

describe('TokenOptimizer', () => {
  let tokenOptimizer: TokenOptimizer;

  beforeAll(async () => {
    jest.setTimeout(60000);
    const moduleRef = await Test.createTestingModule({
      providers: [TokenOptimizer],
    }).compile();

    tokenOptimizer = moduleRef.get<TokenOptimizer>(TokenOptimizer);
  });

  describe('optimize', () => {
    it('입력 문자열의 토큰이 30개 미만인 경우', async () => {
      const queryEnglish = 'tell me what is x-api-tran-id.';
      const queryKorean = 'x-api-tran-id에 대해 알려주세요.';
      const resultEnglish = await tokenOptimizer.optimize(queryEnglish);
      expect(resultEnglish).toEqual(queryEnglish);

      const resultKorean = await tokenOptimizer.optimize(queryKorean);
      expect(resultKorean).toEqual(queryKorean);
    });

    it('입력 문자열이 한글이고 토큰이 30개 초과 하는 경우', async () => {
      const query = `
        안녕하세요, 
        x-api-tran-id에 빠르고 자세하게 설명해 주실 수 있나요? 
        특히, 이 항목이 실제로 어떻게 사용되는지와 발생할 수 있는 문제점들에 대한 정보도 포함해 주세요.
      `;
      const result = await tokenOptimizer.optimize(query);

      const splitter = new SentenceSplitter();
      const originToken = splitter.tokenSize(query);
      const optimizedToken = splitter.tokenSize(result);

      expect(optimizedToken).toBeLessThan(originToken);
    });
  });
});
