# Qoocca Frontend (학원 관리 시스템)
본 프로젝트는 통합 학원 관리 솔루션의 프론트엔드 애플리케이션입니다. 원장님 및 학원 관리자 분들이 학원의 전반적인 업무(원생, 학급, 출결, 결제 관리 등)를 웹에서 편리하게 처리할 수 있도록 돕습니다. Next.js App Router 아키텍처를 기반으로 구축되었습니다.
## 🛠 기술 스택 (Tech Stack)
- **Framework**: [Next.js](https://nextjs.org/) (Version 16.1.6, App Router)
- **Library**: [React](https://react.dev/) (Version 19.2)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Data Fetching**: [Axios](https://axios-http.com/)
- **Styling**: CSS Modules
- **Authentication**: JWT (`jwt-decode`), `js-cookie`
- **UI Components**: `sonner` (알림/토스트 제공)
---
## 🚀 실행 방법 (Getting Started)
### 1. 환경 변수 설정
프로젝트 루트 디렉토리에 `.env.local` 또는 `.env` 파일을 생성하고 필요한 환경 변수를 설정합니다.
```env
NEXT_PUBLIC_API_URL=http://백엔드_서버_URL
```
### 2. 패키지 설치
필요한 라이브러리와 패키지 의존성을 설치합니다.
```bash
npm install
```
### 3. 로컬 서버 실행
로컬 환경에서 개발 서버를 구동합니다.
```bash
npm run dev
```
[http://localhost:3000](http://localhost:3000)으로 접속하여 실행된 애플리케이션을 확인합니다.
### 4. 빌드 및 시작
프로덕션 환경을 위해 빌드하고 실행하려면 아래 명령어를 사용합니다.
```bash
# 빌드
npm run build
# 배포 모드로 실행
npm run start
```
---
## 🖥 주요 화면 및 기능 (Screens & Features)
앱은 크게 **사용자 인증 화면(auth)**과 **학원 관리 대시보드(academy)**로 나뉘어져 있습니다.
### 1. 계정 및 인증 영억 (`/(auth)`)
* **로그인 (`/login`)**: 이메일/비밀번호 로그인 및 소셜 로그인 연동 화면
* **회원가입 (`/signup`)**: 관리자/원장님의 신규 가입 화면
* **소셜/OAuth 연동 (`/social-auth`, `/oauth2`)**: 서드파티 인증 처리 기능
### 2. 학원 관리 인트라넷 영역 (`/academy`)
좌측에 공통 사이드바가 포함되어 있는 관리자용 대시보드 화면입니다.
* **학원 등록 (`/academy/register`)**: 학원 정보를 처음 서비스에 등록하는 페이지
* **학원 대시보드 (`/academy/[academyId]`)**: 학원의 전반적인 통계 및 요약을 한곳에서 확인 가능한 메인 대시보드
* **원생 관리 (`/academy/[academyId]/student`)**: 신규 원생 등록, 상세 정보 조회 및 수정 목록 제공
* **반/수업 관리 (`/academy/[academyId]/class`)**: 학원 내 클래스를 개설하고 수강생을 확인하는 기능
* **출결 관리 (`/academy/[academyId]/attendance`)**: 학생들의 출결 내역을 기록 및 열람할 수 있는 화면
* **수납/결제 관리 (`/academy/[academyId]/payment`)**: 수강료 납부 여부 및 결제 내역을 확인할 수 있는 기능
* **학원 정보 수정 (`/academy/[academyId]/modify`)**: 학원 환경 설정 및 기본 정보를 변경하는 관리 기능
