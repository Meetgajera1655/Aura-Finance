import api from "@/config/axiosInstance";
import NotificationService from '@/components/NotificationService';

export const getChatbotResponse = async (query: string) => {
  try {
    const response = await api.get('/financechatbot/chat', { params: { query } });
    return response;
  } catch (error) {
    NotificationService.error('Failed to get response from finance chatbot. Please try again later.');
    throw error;
  }
}


