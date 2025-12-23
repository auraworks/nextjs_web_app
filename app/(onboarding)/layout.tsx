"use client";

import { useRouter, usePathname } from "next/navigation";

const slides = [
  { id: "start", path: "/slides/start" },
  { id: "end", path: "/slides/end" },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const currentIndex = slides.findIndex((slide) => pathname.includes(slide.id));
  const isFirstPage = currentIndex <= 0;
  const isLastPage = currentIndex >= slides.length - 1;

  const handlePrev = () => {
    if (!isFirstPage) {
      router.push(slides[currentIndex - 1].path);
    }
  };

  const handleNext = () => {
    if (isLastPage) {
      router.push("/login");
    } else {
      router.push(slides[currentIndex + 1].path);
    }
  };

  const handleSkip = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {children}
      </div>

      {/* 하단 네비게이션 */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 왼쪽 화살표 */}
          <button
            onClick={handlePrev}
            disabled={isFirstPage}
            className={`p-2 rounded-full transition-colors ${
              isFirstPage
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* 페이지 인디케이터 */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-colors ${
                  index === currentIndex ? "w-8 bg-blue-500" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* 오른쪽 화살표 */}
          <button
            onClick={handleNext}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* 건너뛰기 버튼 */}
        <button
          onClick={handleSkip}
          className="w-full mt-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          건너뛰기
        </button>
      </div>
    </div>
  );
}
