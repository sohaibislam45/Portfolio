import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlogPost } from '../services/blog';
import Button from '../components/Button';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBlogPost(slug || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-24 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Post not found</p>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white dark:bg-gray-900 py-24"
    >
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/blog">
          <Button variant="outline" size="sm" className="mb-8">
            ← Back to Blog
          </Button>
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>
        <div className="flex items-center space-x-4 mb-8 text-gray-600 dark:text-gray-400">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </motion.article>
  );
};

export default BlogPost;

