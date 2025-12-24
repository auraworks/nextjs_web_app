'use client';

import { useState } from 'react';
import { useChatRooms } from '@/components/hooks/chat';
import AdminChatRoom from './room/page';

export default function AdminChatPage() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { data: rooms = [], isLoading } = useChatRooms();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4">
      {/* 채팅방 목록 */}
      <div className="w-80 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-bold text-lg">문의 목록</h2>
          <p className="text-sm text-gray-500">{rooms.length}개의 문의</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">문의가 없습니다.</p>
          ) : (
            rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${
                  selectedRoomId === room.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">
                    {room.profiles?.name || '알 수 없음'}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      room.status === 'waiting'
                        ? 'bg-yellow-100 text-yellow-700'
                        : room.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {room.status === 'waiting' ? '대기' : room.status === 'active' ? '진행' : '종료'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {room.profiles?.email || ''}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(room.updated_at).toLocaleString('ko-KR')}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* 채팅 내용 */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        {selectedRoomId ? (
          <AdminChatRoom roomId={selectedRoomId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            왼쪽에서 문의를 선택해주세요.
          </div>
        )}
      </div>
    </div>
  );
}
