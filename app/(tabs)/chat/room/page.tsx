'use client';

import { useState, useEffect, useRef } from 'react';
import { useMyRoom, useChatMessages, useSendMessage, useRealtimeMessages } from '@/components/hooks/chat';
import { createClient } from '@/lib/client';

export default function ChatRoom() {
  const [message, setMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: room, isLoading: roomLoading } = useMyRoom();
  const { data: messages = [], isLoading: messagesLoading } = useChatMessages(room?.id);
  const sendMessage = useSendMessage();

  useRealtimeMessages(room?.id);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    getUser();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !room?.id) return;

    await sendMessage.mutateAsync({ 
      roomId: room.id, 
      content: message.trim(),
      senderId: currentUserId || undefined,
    });
    setMessage('');
  };

  if (roomLoading || messagesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* 헤더 */}
      <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg">
        <h2 className="font-bold">관리자 문의</h2>
        <p className="text-sm opacity-80">
          {room?.status === 'waiting' ? '대기 중...' : room?.status === 'active' ? '상담 중' : '종료됨'}
        </p>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            관리자에게 문의할 내용을 입력해주세요.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                  msg.sender_id === currentUserId
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-gray-200 text-gray-800 rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={room?.status === 'closed'}
          />
          <button
            type="submit"
            disabled={!message.trim() || sendMessage.isPending || room?.status === 'closed'}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
}
