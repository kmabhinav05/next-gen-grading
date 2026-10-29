import api from './axios';

export const chatbotService = {
  sendMessage: async (message) => {
    const res = await api.post('/chatbot/message/', { message });
    return res.data;
  },
};
