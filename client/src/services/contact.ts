import { api } from './api';
import { Message } from '../types';

export const submitContact = async (message: Message) => {
  try {
    const response = await api.post('/contact', message);
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.errors || 'Failed to send message',
    };
  }
};

