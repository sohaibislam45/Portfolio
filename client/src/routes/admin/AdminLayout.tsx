import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      // Error handled by toast
    }
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/projects', label: 'Projects', icon: '💼' },
    { path: '/admin/blog', label: 'Blog', icon: '📝' },
    { path: '/admin/messages', label: 'Messages', icon: '✉️' },
    { path: '/admin/testimonials', label: 'Testimonials', icon: '⭐' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Logged in as:</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {currentUser?.email}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

