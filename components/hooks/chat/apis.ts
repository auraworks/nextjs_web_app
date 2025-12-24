import { createClient } from '@/lib/client';
import { ChatRoom, ChatRoomWithUser, ChatMessage, SendMessageParams } from '@/types/chat';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * 메시지를 비동기로 DB에 저장
 */
const saveMessageToDB = async (
  supabase: SupabaseClient,
  params: SendMessageParams,
  userId: string
): Promise<void> => {
  try {
    await supabase
      .from('chat_messages')
      .insert({
        room_id: params.roomId,
        sender_id: userId,
        content: params.content,
      });

    // 채팅방 updated_at 갱신
    await supabase
      .from('chat_rooms')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', params.roomId);
  } catch {
    // 비동기 저장 실패는 무시하고 진행
  }
};

/**
 * Chat 관련 Supabase API 함수 모음
 */
export const chatApis = {
  /**
   * 사용자의 채팅방 조회 (없으면 생성)
   */
  getOrCreateMyRoom: async (): Promise<ChatRoom | null> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // 기존 채팅방 조회
    const { data: existingRoom } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('user_id', user.id)
      .neq('status', 'closed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingRoom) return existingRoom;

    // 없으면 새로 생성
    const { data: newRoom } = await supabase
      .from('chat_rooms')
      .insert({ user_id: user.id })
      .select()
      .single();

    return newRoom;
  },

  /**
   * 모든 채팅방 조회 (관리자용)
   */
  getAllRooms: async (): Promise<ChatRoomWithUser[]> => {
    const supabase = createClient();

    const { data } = await supabase
      .from('chat_rooms')
      .select(`
        *,
        profiles:user_id (name, email)
      `)
      .order('updated_at', { ascending: false });

    return data || [];
  },

  /**
   * 특정 채팅방의 메시지 조회
   */
  getMessages: async (roomId: string): Promise<ChatMessage[]> => {
    const supabase = createClient();

    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    return data || [];
  },

  /**
   * 메시지 전송 (Broadcast 즉시 전달 + 비동기 DB 저장)
   */
  sendMessage: async (params: SendMessageParams): Promise<ChatMessage | null> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // 임시 메시지 객체 생성 (즉시 UI에 표시용)
    const tempMessage: ChatMessage = {
      id: `temp_${Date.now()}`,
      room_id: params.roomId,
      sender_id: user.id,
      content: params.content,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    // 1. Broadcast로 즉시 전달
    const channel = supabase.channel(`room:${params.roomId}`);
    channel.send({
      type: 'broadcast',
      event: 'message',
      payload: tempMessage,
    });

    // 2. 비동기로 DB에 저장 (await하지 않음)
    saveMessageToDB(supabase, params, user.id);

    return tempMessage;
  },

  /**
   * 메시지 읽음 처리
   */
  markAsRead: async (roomId: string): Promise<void> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('room_id', roomId)
      .neq('sender_id', user.id);
  },

  /**
   * 채팅방 상태 변경 (관리자용)
   */
  updateRoomStatus: async (roomId: string, status: 'waiting' | 'active' | 'closed'): Promise<void> => {
    const supabase = createClient();

    await supabase
      .from('chat_rooms')
      .update({ status })
      .eq('id', roomId);
  },
};

/**
 * Realtime 메시지 구독 설정
 */
export const subscribeToRealtimeMessages = (
  roomId: string,
  queryClient: ReturnType<typeof import('@tanstack/react-query').useQueryClient>,
  messagesKey: (roomId: string) => readonly string[]
): (() => void) => {
  const supabase = createClient();

  const channel = supabase
    .channel(`room:${roomId}`)
    .on(
      'broadcast',
      { event: 'message' },
      (payload) => {
        const newMessage = payload.payload as ChatMessage;
        
        queryClient.setQueryData<ChatMessage[]>(
          messagesKey(roomId),
          (old: ChatMessage[] | undefined) => {
            if (!old) return [newMessage];
            const exists = old.some((m: ChatMessage) => m.id === newMessage.id);
            if (exists) return old;
            return [...old, newMessage];
          }
        );
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
