
export enum MessageAuthor {
  USER = 'user',
  VANDVIK = 'vandvik',
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export interface AITool {
  name: string;
  author: string;
  description: string;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export type Mood = 'happy' | 'sad' | 'surprised' | 'neutral';