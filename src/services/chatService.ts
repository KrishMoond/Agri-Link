import api from '../configs/api';

export interface Message {
  _id: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'document' | 'price-quote' | 'order-update';
  attachments: Array<{
    type: string;
    url: string;
    name: string;
  }>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface Chat {
  _id: string;
  chatId: string;
  participants: Array<{
    userId: {
      _id: string;
      name: string;
      profilePicUrl: string;
      role: string;
    };
    role: string;
    joinedAt: string;
  }>;
  relatedTo?: {
    type: 'product' | 'auction' | 'transaction';
    referenceId: string;
  };
  messages: Message[];
  lastMessage: {
    content: string;
    senderId: string;
    timestamp: string;
  };
  isActive: boolean;
  negotiation: {
    isNegotiating: boolean;
    currentOffer: {
      amount: number;
      quantity: number;
      proposedBy: string;
      status: 'pending' | 'accepted' | 'rejected' | 'counter';
    };
    history: Array<{
      amount: number;
      quantity: number;
      proposedBy: string;
      status: string;
      timestamp: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatData {
  participantId: string;
  relatedTo?: {
    type: 'product' | 'auction' | 'transaction';
    referenceId: string;
  };
}

class ChatService {
  async createOrGetChat(data: CreateChatData): Promise<{ chat: Chat }> {
    const response = await api.post('/chats/create', data);
    return response.data;
  }

  async getMyChats(): Promise<Chat[]> {
    const response = await api.get('/chats/my-chats');
    return response.data;
  }

  async getChatById(chatId: string): Promise<Chat> {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  }

  async sendMessage(chatId: string, data: {
    content: string;
    messageType?: 'text' | 'image' | 'document' | 'price-quote' | 'order-update';
    attachments?: Array<{
      type: string;
      url: string;
      name: string;
    }>;
  }): Promise<{ message: string; messageData: Message }> {
    const response = await api.post(`/chats/${chatId}/message`, data);
    return response.data;
  }

  async sendPriceQuote(chatId: string, data: {
    amount: number;
    quantity: number;
    message?: string;
  }): Promise<{ message: string }> {
    const response = await api.post(`/chats/${chatId}/negotiate`, data);
    return response.data;
  }

  async respondToNegotiation(chatId: string, data: {
    action: 'accept' | 'reject';
    message?: string;
  }): Promise<{ message: string; negotiationComplete: boolean }> {
    const response = await api.post(`/chats/${chatId}/negotiate/respond`, data);
    return response.data;
  }

  async getUnreadCount(): Promise<{ unreadCount: number }> {
    const response = await api.get('/chats/unread/count');
    return response.data;
  }

  // Helper methods
  formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  }

  formatChatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString();
      }
    }
  }

  getMessageTypeIcon(type: string): string {
    switch (type) {
      case 'text': return '💬';
      case 'image': return '🖼️';
      case 'document': return '📄';
      case 'price-quote': return '💰';
      case 'order-update': return '📦';
      default: return '💬';
    }
  }

  getOtherParticipant(chat: Chat, currentUserId: string) {
    return chat.participants.find(p => p.userId._id !== currentUserId);
  }

  isMessageFromCurrentUser(message: Message, currentUserId: string): boolean {
    return message.senderId === currentUserId;
  }

  formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  // Real-time functionality (to be implemented with WebSocket)
  subscribeToChat(chatId: string, callback: (message: Message) => void) {
    // This would be implemented with WebSocket connection
    // For now, we can use polling or implement WebSocket later
    console.log(`Subscribing to chat: ${chatId}`);
  }

  unsubscribeFromChat(chatId: string) {
    // Unsubscribe from WebSocket updates
    console.log(`Unsubscribing from chat: ${chatId}`);
  }

  // Notification helpers
  shouldShowNotification(message: Message, currentUserId: string): boolean {
    return message.senderId !== currentUserId && !message.isRead;
  }

  getNotificationText(message: Message, senderName: string): string {
    switch (message.messageType) {
      case 'price-quote':
        return `${senderName} sent a price quote`;
      case 'order-update':
        return `${senderName} updated the order`;
      case 'image':
        return `${senderName} sent an image`;
      case 'document':
        return `${senderName} sent a document`;
      default:
        return `${senderName}: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`;
    }
  }
}

export default new ChatService();