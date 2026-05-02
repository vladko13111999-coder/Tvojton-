import { useParams, Link } from 'react-router-dom';

const blogPosts = {
  'ako-vytvorit-brand-manual': {
    title: 'Ako vytvoriť brand manuál pre SZČO v roku 2026',
    content: '<h2>Prečo potrebuje každé SZČO brand manuál?</h2><p>Brand manuál je nevyhnutný pre konzistentnú komunikáciu.</p>'
  },
  'farby-pre-slovenske-firmy': {
    title: 'Farebná psychológia: Ako farby ovplyvňujú slovenského zákazníka',
    content: '<h2>Farebná psychológia</h2><p>Slovenský zákazník reaguje na farby...</p>'
  },
  'google-fonty-pre-web': {
    title: 'Top 10 Google fontov pre slovenčinu',
    content: '<h2>Google fonty</h2><p>Vyberte fonty podporujúce diakritiku...</p>'
  }
};

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts[id];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Článok nenájdený</h1>
          <Link to="/blog" className="text-indigo-600">← Späť na blog</Link>
        </div>
      </div>
    );
  }

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
            <Link to="/" className="text-gray-700 hover:text-indigo-600">Generátor</Link>
            <Link to="/blog" className="text-indigo-600">Blog</Link>
          </nav>
        </div>
      </header>

      <article className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="text-indigo-600 mb-4 inline-block">← Späť na blog</Link>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-8">{post.title}</h1>
          <div className="prose lg:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="mt-12 p-8 bg-indigo-50 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">Chcete si vytvoriť Brand Kit?</h3>
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
            >
              🚀 Vygenerovať Brand Kit
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
