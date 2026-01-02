"use client";

import { useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function useScrollUp(): AppRouterInstance {
  const router = useRouter();

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    ...router,
    back: () => {
      scrollToTop();
      router.back();
    },
    push: (href: string, options?: Parameters<AppRouterInstance['push']>[1]) => {
      scrollToTop();
      router.push(href, options);
    },
    replace: (href: string, options?: Parameters<AppRouterInstance['replace']>[1]) => {
      scrollToTop();
      router.replace(href, options);
    },
    forward: router.forward,
    refresh: router.refresh,
    prefetch: router.prefetch,
  };
}
