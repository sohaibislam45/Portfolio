import { Link } from 'react-router-dom';
import { useBlogPosts } from '../services/blog';
import Section from '../components/Section';
import SectionTitle from '../components/SectionTitle';
import Card from '../components/Card';
import Button from '../components/Button';

const BlogPreview = () => {
  const { posts, loading } = useBlogPosts();
  const latestPosts = posts.slice(0, 3);

  return (
    <Section id="blog" className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <SectionTitle label="Blog" title="Latest Posts" />
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {latestPosts.map((post) => (
                <Card key={post._id}>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Link to="/blog">
                <Button>View All Posts</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </Section>
  );
};

export default BlogPreview;

