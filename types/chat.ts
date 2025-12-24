/** 채팅방 */
export interface ChatRoom {
  id: string;
  user_id: string;
  status: 'waiting' | 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

/** 채팅방 + 사용자 정보 */
export interface ChatRoomWithUser extends ChatRoom {
  profiles?: {
    name: string;
    email: string;
  };
}

/** 채팅 메시지 */
export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

/** 메시지 전송 파라미터 */
export interface SendMessageParams {
  roomId: string;
  content: string;
  senderId?: string;
}

/** Broadcast 메시지 페이로드 */
export interface BroadcastPayload {
  type: 'new_message';
  message: ChatMessage;
}
