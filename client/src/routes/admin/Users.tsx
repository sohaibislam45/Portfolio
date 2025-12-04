import { useEffect, useState } from 'react';
import { getUsers, updateUserRole, deleteUser } from '../../services/adminApi';
import toast from 'react-hot-toast';
import Button from '../../components/Button';

interface User {
  _id: string;
  uid: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: string, newRole: 'admin' | 'user') => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      await updateUserRole(id, newRole);
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update user role');
    }
  };

  const handleDelete = async (id: string, uid: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
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
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Users</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                UID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono text-xs">
                  {user.uid.substring(0, 20)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value as 'admin' | 'user')}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(user._id, user.uid)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;

