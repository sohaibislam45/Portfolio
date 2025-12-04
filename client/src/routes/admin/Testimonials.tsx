import { useEffect, useState } from 'react';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../../services/adminApi';
import toast from 'react-hot-toast';
import Button from '../../components/Button';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar?: string;
  rating?: number;
  featured: boolean;
  order: number;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    featured: false,
    order: 0,
    avatar: null as File | null,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await getTestimonials();
      setTestimonials(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('rating', formData.rating.toString());
    formDataToSend.append('featured', formData.featured.toString());
    formDataToSend.append('order', formData.order.toString());
    if (formData.company) formDataToSend.append('company', formData.company);
    if (formData.avatar) formDataToSend.append('avatar', formData.avatar);

    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial._id, formDataToSend);
        toast.success('Testimonial updated successfully');
      } else {
        await createTestimonial(formDataToSend);
        toast.success('Testimonial created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await deleteTestimonial(id);
      toast.success('Testimonial deleted successfully');
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete testimonial');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company || '',
      content: testimonial.content,
      rating: testimonial.rating || 5,
      featured: testimonial.featured,
      order: testimonial.order,
      avatar: null,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      company: '',
      content: '',
      rating: 5,
      featured: false,
      order: 0,
      avatar: null,
    });
    setEditingTestimonial(null);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>Add Testimonial</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              {testimonial.avatar && (
                <img
                  src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${testimonial.avatar}`}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
              )}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.role}
                  {testimonial.company && ` at ${testimonial.company}`}
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{testimonial.content}</p>
            {testimonial.rating && (
              <div className="mb-4">
                {'⭐'.repeat(testimonial.rating)}
              </div>
            )}
            {testimonial.featured && (
              <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full mb-4 inline-block">
                Featured
              </span>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)}>
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(testimonial._id)}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Featured
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit">{editingTestimonial ? 'Update' : 'Create'}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowModal(false); resetForm(); }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;

