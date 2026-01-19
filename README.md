# 🚀 AI-Driven Full-Stack Next.js Project

이 프로젝트는 **Webstorm's AI Chat**(Junie)의 성능을 테스트하기 위한 실험적인 시도입니다.  
이 저장소의 모든 코드, 설정 및 문서는 **100% AI에 의해 생성**되었으며, 이는 AI 기반 소프트웨어 개발의 잠재력을 보여주는 사례입니다.

## 🎯 Project Objective
주요 목표는 AI 어시스턴트가 처음부터 풀스택 Next.js 애플리케이션을 얼마나 효과적으로 설계, 구현 및 리팩토링할 수 있는지 평가하는 것이었습니다. 여기에는 다음 내용들이 포함됩니다:
- 복잡한 데이터베이스 모델링 및 마이그레이션.
- 보안 인증 및 세션 관리.
- 견고한 서버 사이드 로직 및 API 라우트 설계.
- 업계 표준 컴포넌트 라이브러리를 사용한 현대적이고 반응형인 UI 구현.

## 🛠️ Tech Stack
- **Framework:** [Next.js 16.1.3](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **UI & Styling:** [shadcn/ui](https://ui.shadcn.com/), Tailwind CSS 4, Lucide React
- **Database:** MySQL 8.0
- **ORM:** [Prisma 6.19.2](https://www.prisma.io/)
- **Authentication:** JWT ([jose](https://github.com/panva/jose) 라이브러리 활용)
- **Validation:** [Zod](https://zod.dev/)
- **Form Management:** React Hook Form
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)

## ✨ Key Features
- **Secure Authentication:**
  - `bcryptjs` 비밀번호 해싱을 적용한 강력한 회원가입 및 로그인 흐름.
  - 세션 쿠키를 삭제하는 안전한 로그아웃 기능.
- **JWT Session Management:** 보안 강화를 위해 HTTP-only, secure 쿠키를 사용한 상태 비저장(Stateless) 인증.
- **Route Protection:** 인증된 경로를 자동으로 보호하고 중복 로그인을 방지하기 위해 Next.js Middleware를 구현했습니다.
- **Interactive Board (CRUD):**
  - **Create:** 자동 작성자 연결 및 검증 로직이 포함된 게시글 생성.
  - **Read:** 동적 리스트 뷰 및 상세 게시글 조회.
  - **Update/Delete:** 권한 기반 작업 (수정/삭제 버튼은 작성자 본인에게만 표시되며 접근 가능).
- **Comprehensive Testing:**
  - Vitest 및 React Testing Library를 사용한 단위, 통합, UI 테스트 구현.
  - Mocking을 활용하여 실제 데이터베이스 연결 없이도 비즈니스 로직 및 API 검증 가능.
- **Modern User Experience:** shadcn/ui의 세련된 UI 컴포넌트와 커스텀 스타일링이 적용된 Sonner 토스트 시스템을 통한 직관적인 피드백 제공.

## 🧪 Testing
이 프로젝트는 테스트 안정성을 위해 Vitest를 도입했습니다.

### 테스트 실행 방법:
```bash
npm run test
```
이 명령어를 실행하면 서비스 레이어, API 라우트, 그리고 프론트엔드 컴포넌트에 대한 모든 테스트가 실행됩니다.

## 🛡️ Error Handling Architecture
이 프로젝트는 보안과 명확한 피드백을 위해 설계된 정교하고 중앙 집중화된 에러 처리 시스템을 갖추고 있습니다:

- **Custom Error Hierarchy:**
  - `PublicError`: 사용자에게 메시지를 그대로 전달해도 안전한 에러 클래스 (예: `BadRequestError`, `UnauthorizedError`, `NotFoundError`).
  - `ServerError`: 내부 서버 오류를 위한 클래스. 서버 콘솔에는 상세한 스택 트레이스를 기록하지만, 민감한 정보 유출 방지 및 보안을 위해 클라이언트에는 일반적인 오류 메시지만 반환합니다.
- **Unified API Handler:** 모든 API 라우트는 일관된 `handleApiError` 유틸리티를 사용하여 모든 에러 상황에서 표준화된 JSON 응답을 보장합니다.
- **Full-Stack Validation:** Zod로 정의된 스키마를 프론트엔드(클라이언트 사이드 검증)와 백엔드(데이터 무결성 보장) 양측에서 재사용하여 "단일 진실 공급원(Single Source of Truth)" 검증 체계를 구축했습니다.

## 📦 Dependencies
### Core
- `next`: 16.1.3
- `react`: 19.2.3
- `@prisma/client`: 6.19.2
- `jose`: 6.1.3
- `zod`: 4.3.5

### UI & UX
- `tailwindcss`: 4.x
- `sonner`: 2.0.7
- `react-hook-form`: 7.71.1
- `lucide-react`: 0.562.0

---
**Disclaimer:** 이 프로젝트는 수동 코드 수정이 전혀 없는, 100% AI의 능력만으로 구현된 결과물입니다. 현대 웹 개발 생태계에서 AI가 도달한 기술적 정점을 보여줍니다.
