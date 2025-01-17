# 닮은 연예인 찾기 웹 애플리케이션


## 서비스 소개

이 프로젝트는 사용자가 업로드한 이미지를 분석하여 닮은 연예인을 찾아주는 웹 애플리케이션입니다. 
Google의 Gemini API를 사용하여 이미지를 분석하고, TMDB(The Movie Database) API를 통해 연예인의 정보와 이미지를 가져옵니다.

주요 기능:
- 사용자 이미지 업로드
- 이미지 분석을 통한 닮은 연예인 찾기(이름으로 결과가 나옵니다.)
- 찾은 연예인의 이미지 표시(결과로 나온 이름을 이용해 이미지를 검색 후 표시합니다.)

<br />

## 결과물 미리 보기
![Pasted image 20240804143431](https://github.com/user-attachments/assets/0eb792f1-82db-4483-b881-fd26852d3a1d)
![Pasted image 20240804143458](https://github.com/user-attachments/assets/eb0c347c-63eb-4092-b899-e5704afef7b7)
![Pasted image 20240804143518](https://github.com/user-attachments/assets/f572b6f2-4262-4a11-92a3-265ffc82da55)

<br />

## 사전 세팅

### 필요한 API 키

1. Google Gemini API 키
2. TMDB API 키

### API 키 발급 방법

1. Google Gemini API 키 발급:
   - [Google AI Studio](https://makersuite.google.com/app/apikey)에 접속합니다.
   - Google 계정으로 로그인 후, API 키를 생성합니다.

2. TMDB API 키 발급:
   - [TMDB 웹사이트](https://www.themoviedb.org/)에 가입합니다.
   - 설정 > API > API 키 요청에서 새로운 API 키를 발급받습니다.

### .env 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음과 같이 API 키를 설정합니다:
```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
```

<br />


## 서비스 이용 방법

1. 프로젝트를 클론하고 필요한 패키지를 설치합니다:
```bash
git clone https://github.com/Subak-Uncle/Google-Gemini-API--hackathon
cd [project_directory]
npm install
```

2. `.env` 파일을 설정합니다.

3. 애플리케이션을 실행합니다:
```bash
npm start
```

4. 웹 브라우저에서 `http://localhost:3000`으로 접속합니다.
![Pasted image 20240804143539](https://github.com/user-attachments/assets/72026564-8152-4894-baf4-06413eb6254b)



5. "업로드" 버튼을 클릭하여 이미지를 선택합니다.
![Pasted image 20240804143555](https://github.com/user-attachments/assets/3eb0e311-782e-4be3-9a93-1f002d201cff)



6. "결과 보기" 버튼을 클릭하여 닮은 연예인을 찾습니다.

7. 분석 결과로 닮은 연예인의 이름과 이미지가 표시됩니다.

![Pasted image 20240804143431](https://github.com/user-attachments/assets/0eb792f1-82db-4483-b881-fd26852d3a1d)

> 주의: 이미지 분석에는 약간의 시간이 소요될 수 있습니다. 분석 중에는 "분석 중..." 메시지가 표시됩니다.




