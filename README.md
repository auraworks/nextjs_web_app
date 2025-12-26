# Next.js Web App

Next.js 16 App Router 기반의 풀스택 웹 애플리케이션입니다. Supabase를 활용한 인증 및 데이터베이스 관리, TailwindCSS를 통한 모던 UI 구현, React Query를 활용한 효율적인 상태 관리를 특징으로 합니다.

## 📋 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS |
| **Authentication** | Supabase Auth |
| **Database** | Supabase (PostgreSQL) |
| **State Management** | React Query |
| **HTTP Client** | Axios |

---

## 📁 프로젝트 구조

```
nextjs_web_app/
├── app/                                    # Next.js App Router
│   ├── layout.tsx                          # 루트 레이아웃 (html, body)
│   ├── page.tsx                            # 루트 페이지 (/) - 인증 상태 확인 후 리다이렉트
│   ├── globals.css                         # 전역 스타일
│   │
│   ├── (auth)/                             # 인증 라우트 그룹
│   │   ├── layout.tsx                      # 인증 페이지 공통 레이아웃
│   │   ├── login/                          # 로그인 페이지 (/login)
│   │   │   ├── page.tsx                    # 로그인 폼 (React Hook Form + Zod)
│   │   │   ├── components/
│   │   │   │   ├── GooglePage.tsx          # Google OAuth
│   │   │   │   ├── ApplePage.tsx           # Apple OAuth
│   │   │   │   └── KakaoPage.tsx           # Kakao OAuth
│   │   │   └── types.ts                    # 로그인 관련 타입
│   │   └── signup/                         # 회원가입 페이지 (/signup)
│   │       ├── page.tsx
│   │       ├── components/
│   │       └── types.ts
│   │
│   ├── (onboarding)/                       # 온보딩 라우트 그룹
│   │   ├── layout.tsx                      # 온보딩 공통 레이아웃
│   │   └── slides/                         # 온보딩 슬라이드
│   │       ├── start/                      # 시작 슬라이드 (/slides/start)
│   │       │   └── page.tsx
│   │       └── end/                        # 마지막 슬라이드 (/slides/end)
│   │           └── page.tsx
│   │
│   └── (tabs)/                             # 메인 앱 탭 라우트 그룹 (인증 필요)
│       ├── layout.tsx                      # 탭바 포함 공통 레이아웃
│       ├── home/                           # 홈 탭 (/home)
│       │   ├── page.tsx
│       │   ├── components/
│       │   └── types.ts
│       ├── chat/                           # 채팅 탭 (/chat)
│       │   ├── page.tsx
│       │   ├── components/
│       │   └── types.ts
│       ├── product/                        # 상품 탭 (/product)
│       │   ├── page.tsx
│       │   ├── components/
│       │   └── types.ts
│       └── mypage/                         # 마이페이지 탭 (/mypage)
│           ├── page.tsx
│           ├── edit/                       # 회원정보 수정 (/mypage/edit)
│           │   ├── page.tsx
│           │   ├── components/
│           │   └── types.ts
│           ├── components/
│           └── types.ts
│
├── components/                             # 공용 컴포넌트 및 유틸리티
│   ├── common/                             # 공용 UI 컴포넌트
│   │   ├── Button/
│   │   ├── Input/
│   │   └── ...
│   ├── ui/                                 # shadcn/ui 컴포넌트
│   ├── hooks/                              # 공용 커스텀 훅
│   │   ├── users/
│   │   │   ├── keys.ts                     # Query Key Factory
│   │   │   ├── apis.ts                     # Supabase API 함수
│   │   │   ├── queries.ts                  # useQuery 훅
│   │   │   ├── mutations.ts                # useMutation 훅
│   │   │   └── index.ts                    # Barrel export
│   │   └── ...
│   ├── store/                              # Zustand 상태 관리
│   │   └── ...
│   └── lib/                                # 공용 유틸리티 함수
│       └── ...
│
├── context/                                # React Context
│   └── SessionProvider.tsx                 # 세션 컨텍스트 프로바이더
│
├── lib/                                    # 라이브러리 및 설정
│   ├── client.ts                           # Supabase 클라이언트 (브라우저용)
│   ├── server.ts                           # Supabase 클라이언트 (서버용)
│   └── ...
│
├── providers/                              # 프로바이더 컴포넌트
│   └── QueryProvider.tsx                   # React Query 프로바이더
│
├── types/                                  # 전역 TypeScript 타입
│   ├── author.ts
│   ├── mypage.ts
│   └── ...
│
├── public/                                 # 정적 파일 (이미지, 폰트 등)
│
├── proxy.ts                                # Next.js 16 Proxy (인증 및 라우트 보호)
├── next.config.ts                          # Next.js 설정
├── tailwind.config.ts                      # TailwindCSS 설정
├── tsconfig.json                           # TypeScript 설정
├── package.json                            # 의존성 관리
└── README.md                               # 프로젝트 문서
```

---

## 🛣️ 라우팅 구조

### 공개 라우트 (미인증 사용자)
| 경로 | 설명 |
|------|------|
| `/` | 인증 상태 확인 후 자동 리다이렉트 |
| `/slides/start` | 온보딩 시작 페이지 |
| `/slides/end` | 온보딩 마지막 페이지 |
| `/login` | 로그인 페이지 (Google, Apple, Kakao OAuth 지원) |
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

## 🔐 인증 흐름

```
┌─────────────────────┐
│   미인증 사용자      │
└──────────┬──────────┘
           │
           ▼
        / (루트)
           │
           ▼
    /slides/start
           │
           ▼
     /slides/end
           │
           ▼
      /login (또는 /signup)
           │
      [로그인 성공]
           │
           ▼
      /home (탭바 표시)
           │
      ┌────┼────┬────────┐
      │    │    │        │
      ▼    ▼    ▼        ▼
    /chat /home /product /mypage
```

---

## 🔑 주요 파일 및 개념

### `proxy.ts`
Next.js 16의 Proxy 파일로, 모든 요청에 대해 인증 상태를 확인합니다.
- **보호된 라우트**: 미인증 사용자 접근 시 `/`로 리다이렉트
- **공개 라우트**: 인증된 사용자 접근 시 `/home`으로 리다이렉트

### `lib/client.ts` & `lib/server.ts`
Supabase 클라이언트 설정
- **client.ts**: 브라우저 환경에서 사용 (`createBrowserClient`)
- **server.ts**: 서버 컴포넌트에서 사용 (`createServerClient`)

### Route Groups (라우트 그룹)
URL 구조에 영향을 주지 않으면서 레이아웃을 공유하는 Next.js 기능
- `(auth)`: 인증 페이지 공통 레이아웃
- `(onboarding)`: 온보딩 페이지 공통 레이아웃
- `(tabs)`: 메인 앱 페이지 공통 레이아웃 (탭바)

### React Query 훅 구조
`components/hooks/` 디렉토리에서 도메인별로 React Query 훅을 관리합니다.

#### 파일 구성 (예: `components/hooks/users/`)
- **`keys.ts`**: Query Key Factory 패턴으로 쿼리 키 관리
  ```typescript
  export const userKeys = {
    all: ['users'] as const,
    profile: () => [...userKeys.all, 'profile'] as const,
    detail: (id: string) => [...userKeys.all, 'detail', id] as const,
  };
  ```

- **`apis.ts`**: Supabase API 함수 (순수 함수)
  ```typescript
  export const getProfile = async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  };
  ```

- **`queries.ts`**: `useQuery` 훅 (데이터 조회)
  ```typescript
  export const useGetProfile = (userId: string) => {
    return useQuery({
      queryKey: userKeys.profile(),
      queryFn: () => getProfile(userId),
    });
  };
  ```

- **`mutations.ts`**: `useMutation` 훅 (데이터 수정/삭제)
  ```typescript
  export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (params: UpdateProfileParams) => updateProfile(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      },
    });
  };
  ```

- **`index.ts`**: Barrel export로 모든 훅 한 번에 import
  ```typescript
  export * from './queries';
  export * from './mutations';
  export { userKeys } from './keys';
  ```

### 컴포넌트 구조
- **Page 컴포넌트**: Server Component (기본값)
- **기능 컴포넌트**: `components/` 폴더에 분리 (Client Component)
- **공용 컴포넌트**: `components/common/` 또는 `components/ui/`
- **타입 정의**: 각 페이지 디렉토리의 `types.ts`에 통합

### 데이터 흐름
```
Page (Server Component)
  ↓
Client Component (useQuery/useMutation)
  ↓
React Query (캐싱, 동기화)
  ↓
Supabase Client
  ↓
PostgreSQL Database
```

---

## 🚀 시작하기

### 1️⃣ 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 변수를 설정하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2️⃣ 의존성 설치

```bash
npm install
```

### 3️⃣ 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

### 4️⃣ 프로덕션 빌드

```bash
npm run build
npm start
```

---

## 📚 개발 가이드

### 1. React Query 훅 작성

#### Query Key Factory 패턴 (`keys.ts`)
```typescript
// components/hooks/users/keys.ts
export const userKeys = {
  all: ['users'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};
```

#### API 함수 작성 (`apis.ts`)
Supabase 클라이언트를 직접 사용하는 순수 함수입니다.

```typescript
// components/hooks/users/apis.ts
import { createClient } from '@/lib/client';
import { UpdateProfileParams } from '@/types/mypage';

export const getProfile = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) return null;
  return data;
};

export const updateProfile = async (params: UpdateProfileParams): Promise<boolean> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from('profiles')
    .update({
      name: params.name,
      phone: params.phone,
      birthdate: params.birthdate,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  return !error;
};
```

#### useQuery 훅 (`queries.ts`)
```typescript
// components/hooks/users/queries.ts
import { useQuery } from '@tanstack/react-query';
import { userKeys } from './keys';
import { getProfile } from './apis';

export const useGetProfile = (userId: string) => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => getProfile(userId),
  });
};
```

#### useMutation 훅 (`mutations.ts`)
```typescript
// components/hooks/users/mutations.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userKeys } from './keys';
import { updateProfile, deleteProfile } from './apis';
import { UpdateProfileParams } from '@/types/mypage';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateProfileParams) => updateProfile(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};
```

#### Barrel Export (`index.ts`)
```typescript
// components/hooks/users/index.ts
export * from './queries';
export * from './mutations';
export { userKeys } from './keys';
```

### 2. 컴포넌트에서 React Query 사용

Client Component에서 훅을 사용합니다.

```typescript
'use client';

import { useGetProfile, useUpdateProfile } from '@/components/hooks/users';
import { UpdateProfileParams } from '@/types/mypage';

export function ProfileEditor({ userId }: { userId: string }) {
  const { data: profile, isLoading } = useGetProfile(userId);
  const { mutate: updateProfile } = useUpdateProfile();

  const handleSubmit = (params: UpdateProfileParams) => {
    updateProfile(params, {
      onSuccess: () => {
        alert('프로필이 수정되었습니다.');
      },
    });
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        name: 'New Name',
        phone: '010-1234-5678',
        birthdate: '1990-01-01',
      });
    }}>
      {/* 폼 내용 */}
    </form>
  );
}
```

### 3. 페이지 구성

#### Server Component (page.tsx)
```typescript
// app/(tabs)/mypage/page.tsx
import { createClient } from '@/lib/server';
import { ProfileEditor } from './components/ProfileEditor';

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div>
      <h1>마이페이지</h1>
      <ProfileEditor userId={user.id} />
    </div>
  );
}
```

#### Client Component (components/)
```typescript
// app/(tabs)/mypage/components/ProfileEditor.tsx
'use client';

import { useGetProfile, useUpdateProfile } from '@/components/hooks/users';

export function ProfileEditor({ userId }: { userId: string }) {
  const { data: profile } = useGetProfile(userId);
  const { mutate: updateProfile } = useUpdateProfile();

  return (
    <div>
      {/* 프로필 수정 UI */}
    </div>
  );
}
```

### 4. 타입 정의

각 페이지 디렉토리에 `types.ts` 파일을 생성하여 타입을 관리합니다.

```typescript
// app/(tabs)/mypage/types.ts
export interface Profile {
  id: string;
  name: string;
  phone: string;
  birthdate: string;
  updated_at: string;
}

export interface UpdateProfileParams {
  name: string;
  phone: string;
  birthdate: string;
}
```

### 5. 컴포넌트 폴더 구조

페이지별로 `components/` 폴더를 만들어 기능 단위로 컴포넌트를 분리합니다.

```
app/(tabs)/mypage/
├── page.tsx                           # Server Component
├── components/
│   ├── ProfileEditor.tsx              # Client Component
│   ├── ProfileForm.tsx                # Client Component
│   └── DeleteAccountButton.tsx        # Client Component
└── types.ts                           # 타입 정의
```

### 6. 주의사항

- **'use client' 선언**: React Query 훅을 사용하는 컴포넌트는 반드시 Client Component여야 합니다.
- **Query Key**: 항상 Query Key Factory 패턴을 사용하여 일관성 있게 관리합니다.
- **캐시 무효화**: 데이터 수정 후 `queryClient.invalidateQueries()`로 캐시를 무효화합니다.
- **에러 처리**: API 함수에서 에러를 처리하고, 컴포넌트에서는 React Query의 에러 상태를 활용합니다.

---

## 🔗 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)



