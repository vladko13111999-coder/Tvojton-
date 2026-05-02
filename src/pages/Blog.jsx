import { Link } from 'react-router-dom';

const blogPosts = [
  { id: 'ako-vytvorit-brand-manual', title: 'Ako vytvoriť brand manuál pre SZČO', excerpt: 'Kompletný sprievodca tvorbou brand manuálu.' },
  { id: 'farby-pre-slovenske-firmy', title: 'Farebná psychológia pre slovenské firmy', excerpt: 'Ako farby ovplyvňujú rozhodovanie.' },
  { id: 'google-fonty-pre-web', title: 'Google fonty podporujúce slovenčinu', excerpt: 'Vyberte správne fonty pre váš web.' }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">tvojton.online</h1>
          </div>
          <nav className="flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">Generátor</Link>
            <Link to="/blog" className="text-indigo-600 font-medium">Blog</Link>
          </nav>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-12 text-center">Blog</h1>
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  <Link to={`/blog/${post.id}`} className="hover:text-indigo-600">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  Čítať viac →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
