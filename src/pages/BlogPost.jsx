import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogPosts from '../data/blogPosts';
import AdSenseSlots from '../components/AdSenseSlots';

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | tvojton.online`;
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Článok nenájdený</h1>
          <Link to="/blog" className="text-indigo-600 hover:text-indigo-700">
            ← Späť na blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">tvojton.online</h1>
            </div>
          </div>
          <nav className="flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">Generátor</Link>
            <Link to="/blog" className="text-indigo-600 font-medium">Blog</Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/blog" className="text-indigo-600 hover:text-indigo-700 inline-flex items-center mb-4">
              ← Späť na všetky články
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-gray-500 space-x-4">
              <span>{new Date(post.date).toLocaleDateString('sk-SK')}</span>
              <span>•</span>
              <span>{post.tags.join(', ')}</span>
            </div>
          </div>

          {/* AdSense */}
          <AdSenseSlots position="inContent" />

          <div className="mt-8 prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tagy:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-indigo-50 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Chcete si vytvoriť vlastný Brand Kit?
            </h3>
            <p className="text-gray-600 mb-6">
              Využite náš generátor a vytvorte si brand manuál za 2 minúty zadarmo.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors"
            >
              🚀 Vygenerovať Brand Kit
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 tvojton.online - Všetky práva vyhradené</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;
