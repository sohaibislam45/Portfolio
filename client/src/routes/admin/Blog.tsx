import { useEffect, useState } from 'react';
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../../services/adminApi';
import toast from 'react-hot-toast';
import Button from '../../components/Button';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags: string[];
  createdAt: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    tags: '',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getBlogPosts(1, 100);
      setPosts(response.data.blogPosts);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: editingPost ? formData.slug : generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
    };

    try {
      if (editingPost) {
        await updateBlogPost(editingPost._id, data);
        toast.success('Blog post updated successfully');
      } else {
        await createBlogPost(data);
        toast.success('Blog post created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save blog post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await deleteBlogPost(id);
      toast.success('Blog post deleted successfully');
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete blog post');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      tags: post.tags.join(', '),
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      tags: '',
    });
    setEditingPost(null);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>Add Post</Button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{post.excerpt}</p>
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(post._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingPost ? 'Edit Blog Post' : 'Add Blog Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Excerpt
                </label>
                <input
                  type="text"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content (Markdown)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={15}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit">{editingPost ? 'Update' : 'Create'}</Button>
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

export default Blog;

