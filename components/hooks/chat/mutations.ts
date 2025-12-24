'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatKeys } from './keys';
import { chatApis } from './apis';
import { SendMessageParams, ChatMessage } from '@/types/chat';

/**
 * 메시지 전송 뮤테이션 (Broadcast 즉시 전달 + 비동기 DB 저장)
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SendMessageParams) => chatApis.sendMessage(params),
    onMutate: async (params: SendMessageParams) => {
      // 이전 메시지 데이터 백업
      const previousMessages = queryClient.getQueryData<ChatMessage[]>(chatKeys.messages(params.roomId));

      // Optimistic update: 즉시 UI에 메시지 추가
      queryClient.setQueryData(
        chatKeys.messages(params.roomId),
        (old: ChatMessage[] = []) => [
          ...old,
          {
            id: `temp_${Date.now()}`,
            room_id: params.roomId,
            sender_id: params.senderId || 'unknown',
            content: params.content,
            is_read: false,
            created_at: new Date().toISOString(),
          },
        ]
      );

      return { previousMessages };
    },
    onError: (_, params, context) => {
      // 실패 시 이전 데이터로 복원
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messages(params.roomId),
          context.previousMessages
        );
      }
    },
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
