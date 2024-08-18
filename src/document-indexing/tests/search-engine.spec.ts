import { Test } from '@nestjs/testing';
import { FileReader } from '../domain/file-reader';
import { SearchEngine } from '../domain/search-engine';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('SearchEngine', () => {
  let searchEngine: SearchEngine;

  beforeAll(async () => {
    jest.setTimeout(60000);
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'src/env/.env',
        }),
      ],
      providers: [SearchEngine, FileReader, ConfigService],
    }).compile();

    searchEngine = moduleRef.get<SearchEngine>(SearchEngine);
    await searchEngine.init();
  });

  describe('search-engine', () => {
    it('사용자가 여러개의 질문을 한 경우 이전 컨텍스트의 질문을 기억 하는지 여부', async () => {
      const firstQuery = 'x-api-tran-id에 대해 알려주세요.';
      const secondQuery = '토큰이 중복 발급되었을 경우 어떻게 되나요?';
      const thirdQuery = '정보 전송 요구 연장은 언제 가능한가요?';
      const forthQuery = 'API 스펙 중 aNS는 어떤 것을 뜻하나요?';

      await searchEngine.multiTurn(firstQuery);
      await searchEngine.multiTurn(secondQuery);
      await searchEngine.multiTurn(thirdQuery);
      await searchEngine.multiTurn(forthQuery);

      const checkQuery = '내가 처음 물어본 질문이 뭐였는지 알려줘';
      const result = await searchEngine.multiTurn(forthQuery);
      console.log({ result });
    });
  });
});
