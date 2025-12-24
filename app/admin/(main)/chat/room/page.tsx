'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatMessages, useSendMessage, useRealtimeMessages, useUpdateRoomStatus, useChatRooms } from '@/components/hooks/chat';
import { createClient } from '@/lib/client';

interface AdminChatRoomProps {
  roomId: string;
}

export default function AdminChatRoom({ roomId }: AdminChatRoomProps) {
  const [message, setMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: rooms = [] } = useChatRooms();
  const room = rooms.find((r) => r.id === roomId);
  const { data: messages = [], isLoading } = useChatMessages(roomId);
  const sendMessage = useSendMessage();
  const updateStatus = useUpdateRoomStatus();

  useRealtimeMessages(roomId);

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
    if (!message.trim()) return;

    // 첫 응답 시 상태를 active로 변경
    if (room?.status === 'waiting') {
      await updateStatus.mutateAsync({ roomId, status: 'active' });
    }

    await sendMessage.mutateAsync({ roomId, content: message.trim() });
    setMessage('');
  };

  const handleClose = async () => {
    if (confirm('이 문의를 종료하시겠습니까?')) {
      await updateStatus.mutateAsync({ roomId, status: 'closed' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="font-bold">{room?.profiles?.name || '사용자'}</h3>
          <p className="text-sm text-gray-500">{room?.profiles?.email}</p>
        </div>
        {room?.status !== 'closed' && (
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            문의 종료
          </button>
        )}
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
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
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      {room?.status !== 'closed' ? (
        <form onSubmit={handleSend} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="답변을 입력하세요..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!message.trim() || sendMessage.isPending}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              전송
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 border-t bg-gray-100 text-center text-gray-500">
          종료된 문의입니다.
        </div>
      )}
    </div>
  );
}
