# Next.js Web App

Next.js 16 App Router 기반의 웹 애플리케이션입니다. Supabase 인증과 TailwindCSS를 사용합니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)

---

## 프로젝트 구조

```
nextjs_web_app/
├── app/                          # Next.js App Router 디렉토리
│   ├── layout.tsx                # 전체 앱 공통 레이아웃 (html, body)
│   ├── page.tsx                  # 루트 페이지 (/) - 인증 상태에 따라 리다이렉트
│   ├── globals.css               # 전역 스타일
│   │
│   ├── (auth)/                   # 인증 관련 라우트 그룹
│   │   ├── layout.tsx            # 인증 페이지 공통 레이아웃 (중앙 정렬)
│   │   ├── login/                # 로그인 페이지 (/login)
│   │   │   ├── page.tsx          # 로그인 폼
│   │   │   ├── GooglePage.tsx    # Google 소셜 로그인
│   │   │   ├── ApplePage.tsx     # Apple 소셜 로그인
│   │   │   └── KakaoPage.tsx     # Kakao 소셜 로그인
│   │   └── signup/               # 회원가입 페이지 (/signup)
│   │       └── page.tsx          # 회원가입 폼
│   │
│   ├── (onboarding)/             # 온보딩 라우트 그룹
│   │   ├── layout.tsx            # 온보딩 공통 레이아웃 (네비게이션, 건너뛰기 버튼)
│   │   └── slides/               # 온보딩 슬라이드 페이지들
│   │       ├── start/            # 시작 슬라이드 (/slides/start)
│   │       │   └── page.tsx
│   │       └── end/              # 마지막 슬라이드 (/slides/end)
│   │           └── page.tsx
│   │
│   └── (tabs)/                   # 메인 앱 탭 라우트 그룹 (인증 필요)
│       ├── layout.tsx            # 탭바 포함 공통 레이아웃
│       ├── home/                 # 홈 탭 (/home)
│       │   └── page.tsx
│       ├── chat/                 # 채팅 탭 (/chat)
│       │   └── page.tsx
│       ├── product/              # 상품 탭 (/product)
│       │   └── page.tsx
│       └── mypage/               # 마이페이지 탭 (/mypage)
│           ├── page.tsx          # 마이페이지 메인
│           └── edit/             # 회원정보 수정 (/mypage/edit)
│               └── page.tsx
│
├── components/                   # 공용 컴포넌트
│   ├── Button/                   # 버튼 컴포넌트
│   └── hooks/                    # 공용 커스텀 훅
│
├── context/                      # React Context
│   └── SessionProvider.tsx       # 세션 컨텍스트 프로바이더
│
├── lib/                          # 유틸리티 라이브러리
│   ├── client.ts                 # Supabase 클라이언트 (브라우저용)
│   └── server.ts                 # Supabase 클라이언트 (서버용)
│
├── providers/                    # 프로바이더 컴포넌트
│   └── QueryProvider.tsx         # React Query 프로바이더
│
├── types/                        # TypeScript 타입 정의
│   ├── author.ts                 # 작성자 관련 타입
│   └── mypage.ts                 # 마이페이지 관련 타입 (Profile)
│
├── public/                       # 정적 파일
│
├── proxy.ts                      # Next.js 16 Proxy (인증 및 라우트 보호)
├── next.config.ts                # Next.js 설정
├── tailwind.config.ts            # TailwindCSS 설정
├── tsconfig.json                 # TypeScript 설정
└── package.json                  # 의존성 관리
```

---

## 라우팅 구조

### 공개 라우트 (미인증 사용자)
| 경로 | 설명 |
|------|------|
| `/` | 인증 상태 확인 후 리다이렉트 |
| `/slides/start` | 온보딩 시작 페이지 |
| `/slides/end` | 온보딩 마지막 페이지 |
| `/login` | 로그인 페이지 |
| `/signup` | 회원가입 페이지 |

### 보호된 라우트 (인증 필요)
| 경로 | 설명 |
|------|------|
| `/home` | 홈 화면 (탭바 포함) |
| `/chat` | 채팅 화면 |
| `/product` | 상품 화면 |
| `/mypage` | 마이페이지 |
| `/mypage/edit` | 회원정보 수정 |

---

## 인증 흐름

```
[미인증 사용자]
    │
    ▼
    / (루트)
    │
    ▼
/slides/start → /slides/end → /login
    │                            │
    │         [로그인 성공]       │
    │◄───────────────────────────┘
    │
    ▼
  /home (탭바 표시)
    │
    ├── /chat
    ├── /product
    └── /mypage
```

---

## 주요 파일 설명

### `proxy.ts`
Next.js 16의 Proxy 파일로, 모든 요청에 대해 인증 상태를 확인하고 라우트를 보호합니다.
- 보호된 라우트 접근 시 미인증 사용자 → `/`로 리다이렉트
- 공개 라우트 접근 시 인증된 사용자 → `/home`으로 리다이렉트

### `lib/client.ts`
브라우저에서 사용하는 Supabase 클라이언트입니다. `@supabase/ssr`의 `createBrowserClient`를 사용하여 쿠키 기반 인증을 지원합니다.

### `lib/server.ts`
서버 컴포넌트에서 사용하는 Supabase 클라이언트입니다. `@supabase/ssr`의 `createServerClient`를 사용합니다.

### Route Groups (라우트 그룹)
- `(auth)`: 인증 관련 페이지들의 공통 레이아웃 적용
- `(onboarding)`: 온보딩 페이지들의 공통 레이아웃 적용 (네비게이션, 건너뛰기)
- `(tabs)`: 메인 앱 페이지들의 공통 레이아웃 적용 (탭바)

> 라우트 그룹은 URL에 영향을 주지 않고 레이아웃을 공유할 수 있게 해줍니다.

---

## 시작하기

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 개발 서버 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 빌드

```bash
npm run build
npm start
```

---

## 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
