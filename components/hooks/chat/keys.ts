/**
 * Chat 관련 Query Key Factory
 */
export const chatKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatKeys.all, 'rooms'] as const,
  room: (roomId: string) => [...chatKeys.all, 'room', roomId] as const,
  messages: (roomId: string) => [...chatKeys.all, 'messages', roomId] as const,
  myRoom: () => [...chatKeys.all, 'myRoom'] as const,
};
