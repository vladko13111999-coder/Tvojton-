import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogPosts from '../data/blogPosts';
import AdSenseSlots from '../components/AdSenseSlots';

const Blog = () => {
  useEffect(() => {
    document.title = 'Blog | tvojton.online - Branding pre slovenské firmy';
  }, []);

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
              <p className="text-sm text-gray-600">Brand Kit Generator</p>
            </div>
          </div>
          <nav className="flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">Generátor</Link>
            <Link to="/blog" className="text-indigo-600 font-medium">Blog</Link>
          </nav>
        </div>
      </header>

      {/* Blog Header */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Branding Blog
          </h1>
          <p className="text-xl text-gray-600">
            Tipy pre slovenské firmy a SZČO: branding, farby, fonty, tón komunikácie a SEO stratégie pre rok 2026.
          </p>
        </div>
      </section>

      {/* AdSense */}
      <div className="max-w-7xl mx-auto px-4">
        <AdSenseSlots position="header" />
      </div>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-6xl">📝</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{new Date(post.date).toLocaleDateString('sk-SK')}</span>
                    <span className="mx-2">•</span>
                    <span>{post.tags[0]}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link to={`/blog/${post.id}`} className="hover:text-indigo-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700"
                  >
                    Čítať viac →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 tvojton.online - Všetky práva vyhradené</p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
