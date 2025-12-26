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
    // 채팅방 정보 조회 (수신자 ID 가져오기)
    const { data: room } = await supabase
      .from('chat_rooms')
      .select('user1_id, user2_id')
      .eq('id', params.roomId)
      .single();

    // 송신자가 user1이면 user2가 수신자, 반대면 user1이 수신자
    const receiverId = room?.user1_id === userId ? room?.user2_id : room?.user1_id;

    await supabase
      .from('chat_messages')
      .insert({
        room_id: params.roomId,
        sender_id: userId,
        receiver_id: receiverId || null,
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
      .eq('user1_id', user.id)
      .neq('status', 'closed')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingRoom) return existingRoom;

    // 첫 번째 관리자 조회
    const { data: adminUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    const adminId = adminUsers?.[0]?.id;

    // 없으면 새로 생성
    const { data: newRooms } = await supabase
      .from('chat_rooms')
      .insert({ user1_id: user.id, user2_id: adminId || null })
      .select();

    return newRooms?.[0] || null;
  },

  /**
   * 모든 채팅방 조회 (관리자용)
   */
  getAllRooms: async (): Promise<ChatRoomWithUser[]> => {
    const supabase = createClient();

    // 채팅방 조회
    const { data: rooms } = await supabase
      .from('chat_rooms')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!rooms || rooms.length === 0) {
      return [];
    }

    // 각 채팅방의 사용자 프로필 조회
    const roomsWithProfiles = await Promise.all(
      rooms.map(async (room) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', room.user1_id)
          .single();

        return {
          ...room,
          profiles: profile || { name: '알 수 없음', email: '' },
        };
      })
    );

    return roomsWithProfiles;
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
