import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../../types';

interface MessagesState {
  conversations: { [userId: string]: Message[] };
  currentConversation: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  conversations: {},
  currentConversation: null,
  isLoading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<{ [userId: string]: Message[] }>) => {
      state.conversations = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const { senderId, receiverId } = action.payload;
      const conversationId = senderId < receiverId ? `${senderId}-${receiverId}` : `${receiverId}-${senderId}`;
      
      if (!state.conversations[conversationId]) {
        state.conversations[conversationId] = [];
      }
      state.conversations[conversationId].push(action.payload);
    },
    markAsRead: (state, action: PayloadAction<{ conversationId: string; messageId: string }>) => {
      const { conversationId, messageId } = action.payload;
      const conversation = state.conversations[conversationId];
      if (conversation) {
        const message = conversation.find(m => m.id === messageId);
        if (message) {
          message.isRead = true;
        }
      }
    },
    setCurrentConversation: (state, action: PayloadAction<string | null>) => {
      state.currentConversation = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setConversations, 
  addMessage, 
  markAsRead, 
  setCurrentConversation, 
  setLoading, 
  setError 
} = messagesSlice.actions;
export default messagesSlice.reducer;