import { useEffect, useState } from 'react';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from '../../services/adminApi';
import toast from 'react-hot-toast';
import Button from '../../components/Button';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  thumbnail?: string;
  category: string;
  order: number;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    liveUrl: '',
    repoUrl: '',
    category: 'full-stack',
    order: 0,
    thumbnail: null as File | null,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await getProjects(1, 100);
      setProjects(response.data.projects);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('techStack', JSON.stringify(formData.techStack.split(',').map(t => t.trim())));
    formDataToSend.append('category', formData.category);
    formDataToSend.append('order', formData.order.toString());
    if (formData.liveUrl) formDataToSend.append('liveUrl', formData.liveUrl);
    if (formData.repoUrl) formDataToSend.append('repoUrl', formData.repoUrl);
    if (formData.thumbnail) formDataToSend.append('thumbnail', formData.thumbnail);

    try {
      if (editingProject) {
        await updateProject(editingProject._id, formDataToSend);
        toast.success('Project updated successfully');
      } else {
        await createProject(formDataToSend);
        toast.success('Project created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProject(id);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      liveUrl: project.liveUrl || '',
      repoUrl: project.repoUrl || '',
      category: project.category,
      order: project.order,
      thumbnail: null,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      techStack: '',
      liveUrl: '',
      repoUrl: '',
      category: 'full-stack',
      order: 0,
      thumbnail: null,
    });
    setEditingProject(null);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>Add Project</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {project.thumbnail && (
              <img
                src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${project.thumbnail}`}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(project._id)}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingProject ? 'Edit Project' : 'Add Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Live URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Repo URL
                  </label>
                  <input
                    type="url"
                    value={formData.repoUrl}
                    onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="full-stack">Full Stack</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                  </select>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit">{editingProject ? 'Update' : 'Create'}</Button>
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

export default Projects;

