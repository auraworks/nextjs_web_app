'use client';

import { useState } from 'react';
import ChatRoom from './room/page';

export default function Chat() {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <div className="flex flex-col h-full">
        <button
          onClick={() => setShowChat(false)}
          className="mb-2 text-sm text-gray-500 hover:text-gray-700"
        >
          ← 뒤로가기
        </button>
        <div className="flex-1">
          <ChatRoom />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold text-center mb-4">고객 지원</h1>
      <p className="text-center text-gray-600 mb-6">
        궁금한 점이 있으시면 관리자에게 문의해주세요.
      </p>
      <button
        onClick={() => setShowChat(true)}
        className="w-full max-w-xs bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium"
      >
        관리자한테 문의하기
      </button>
    </div>
  );
}
