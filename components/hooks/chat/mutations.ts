'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatKeys } from './keys';
import { chatApis } from './apis';
import { SendMessageParams } from '@/types/chat';

/**
 * 메시지 전송 뮤테이션 (Broadcast 즉시 전달 + 비동기 DB 저장)
 */
export const useSendMessage = () => {
  return useMutation({
    mutationFn: (params: SendMessageParams) => chatApis.sendMessage(params),
  });
};

/**
 * 메시지 읽음 처리 뮤테이션
 */
export const useMarkAsRead = () => {
  return useMutation({
    mutationFn: (roomId: string) => chatApis.markAsRead(roomId),
  });
};

/**
 * 채팅방 상태 변경 뮤테이션 (관리자용)
 */
export const useUpdateRoomStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, status }: { roomId: string; status: 'waiting' | 'active' | 'closed' }) =>
      chatApis.updateRoomStatus(roomId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
};
