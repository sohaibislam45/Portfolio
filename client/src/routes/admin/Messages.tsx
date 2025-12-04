import { useEffect, useState } from 'react';
import {
  getMessages,
  markMessageRead,
  deleteMessage,
} from '../../services/adminApi';
import toast from 'react-hot-toast';
import Button from '../../components/Button';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      const readFilter = filter === 'read' ? true : filter === 'unread' ? false : undefined;
      const response = await getMessages(1, 100, readFilter);
      setMessages(response.data.messages);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string, read: boolean) => {
    try {
      await markMessageRead(id, read);
      toast.success(`Message marked as ${read ? 'read' : 'unread'}`);
      fetchMessages();
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, read });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update message');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteMessage(id);
      toast.success('Message deleted successfully');
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
      fetchMessages();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread
          </Button>
          <Button
            variant={filter === 'read' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('read')}
          >
            Read
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow ${
                !message.read ? 'border-l-4 border-primary-500' : ''
              } ${selectedMessage?._id === message._id ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{message.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{message.email}</p>
                </div>
                {!message.read && (
                  <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                    New
                  </span>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-2">
                {message.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {selectedMessage && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedMessage.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{selectedMessage.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkRead(selectedMessage._id, !selectedMessage.read)}
                >
                  {selectedMessage.read ? 'Mark Unread' : 'Mark Read'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

