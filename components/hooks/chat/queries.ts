'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { chatKeys } from './keys';
import { chatApis, subscribeToRealtimeMessages } from './apis';

/**
 * 사용자의 채팅방 조회 (없으면 생성)
 */
export const useMyRoom = () => {
  return useQuery({
    queryKey: chatKeys.myRoom(),
    queryFn: chatApis.getOrCreateMyRoom,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 모든 채팅방 조회 (관리자용)
 */
export const useChatRooms = () => {
  return useQuery({
    queryKey: chatKeys.rooms(),
    queryFn: chatApis.getAllRooms,
    staleTime: 1000 * 30,
  });
};

/**
 * 특정 채팅방의 메시지 조회
 */
export const useChatMessages = (roomId: string | undefined) => {
  return useQuery({
    queryKey: chatKeys.messages(roomId || ''),
    queryFn: () => chatApis.getMessages(roomId || ''),
    enabled: !!roomId,
    staleTime: 0,
  });
};

/**
 * Realtime 메시지 구독 훅 (Broadcast)
 */
export const useRealtimeMessages = (roomId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = subscribeToRealtimeMessages(roomId, queryClient, chatKeys.messages);

    return () => {
      unsubscribe();
    };
  }, [roomId, queryClient]);
};
