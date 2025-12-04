import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/adminApi';
import toast from 'react-hot-toast';

interface DashboardStats {
  projects: number;
  blogPosts: number;
  messages: number;
  unreadMessages: number;
  testimonials: number;
  users: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Projects', value: stats?.projects || 0, color: 'bg-blue-500' },
    { label: 'Blog Posts', value: stats?.blogPosts || 0, color: 'bg-green-500' },
    { label: 'Messages', value: stats?.messages || 0, color: 'bg-yellow-500' },
    { label: 'Unread Messages', value: stats?.unreadMessages || 0, color: 'bg-red-500' },
    { label: 'Testimonials', value: stats?.testimonials || 0, color: 'bg-purple-500' },
    { label: 'Users', value: stats?.users || 0, color: 'bg-indigo-500' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                <span className="text-white text-2xl">📊</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

