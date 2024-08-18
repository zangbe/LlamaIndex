## Description

이 프로젝트는 금융 분야의 마이데이터 API와 관련된 문서에서 정보를 검색하고, <br/>
사용자의 질문에 대한 답변을 제공하는 RAG(Retrieval-Augmented Generation) 에이전트를 구축하는 것입니다. <br/>
주요 목표는 LlamaIndex를 사용해 문서에서 임베딩을 생성하고, <br/> 이를 LLM과 연계하여 효율적인 질의응답 시스템을 제공하는 것입니다.

## Before you start

[Llama 3.1](https://llama.meta.com/) 모델 다운로드 필요

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

- 앱 실행 후 웹 브라우저를 열고 http://localhost:3000/api-docs 으로 이동합니다.
- 제공된 입력 창에 질문을 입력하고 "Try it out" 버튼을 클릭합니다.

## Test

```bash
# unit tests
$ npm run test
```
