import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { toast } from "sonner";

function readingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = trpc.blog.bySlug.useQuery({ slug: slug || "" }, { enabled: !!slug });

  // Dynamic SEO meta tags
  useEffect(() => {
    if (!post) return;

    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt || "";
    const ogImage = post.ogImage || "";

    document.title = `${title} | Tvojton.online Blog`;

    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", "article", true);
    setMeta("og:url", window.location.href, true);
    if (ogImage) setMeta("og:image", ogImage, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    return () => {
      document.title = "Tvojton.online - Tvoj osobný AI asistent do vrecka";
    };
  }, [post]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post?.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Odkaz skopírovaný do schránky!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="container">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">T</div>
                <span className="font-semibold text-gray-900">tvojton.online</span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="container py-16 max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Článok nenájdený</h1>
          <p className="text-gray-500 mb-6">Tento článok neexistuje alebo bol odstránený.</p>
          <Link href="/blog">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Späť na blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const minutes = readingTime(post.content);
  const publishDate = post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">T</div>
              <span className="font-semibold text-gray-900">tvojton.online</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">Domov</Link>
              <Link href="/blog" className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg font-medium">Blog</Link>
            </div>
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2 border-gray-200">
                <Bot className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ARTICLE */}
      <article className="py-12">
        <div className="container max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-blue-600 transition-colors">Domov</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-xs">{post.title}</span>
          </div>

          {/* Article header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-blue-50 text-blue-700 border-blue-100">AI</Badge>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                {minutes} min čítania
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg text-gray-500 leading-relaxed mb-6">{post.excerpt}</p>
            )}
            <div className="flex items-center justify-between py-4 border-t border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <time dateTime={publishDate.toISOString()}>
                  {format(publishDate, "d. MMMM yyyy", { locale: sk })}
                </time>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-gray-200 text-gray-600"
                onClick={handleShare}
              >
                <Share2 className="w-3.5 h-3.5" />
                Zdieľať
              </Button>
            </div>
          </header>

          {/* Article content */}
          <div
            className="blog-content text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link href="/blog">
              <Button variant="outline" className="gap-2 border-gray-200">
                <ArrowLeft className="w-4 h-4" />
                Späť na blog
              </Button>
            </Link>
          </div>
        </div>
      </article>

      {/* FOOTER */}
      <footer className="bg-[#0f172a] text-white py-12 mt-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">T</div>
              <span className="font-semibold">tvojton.online</span>
            </div>
            <p className="text-gray-500 text-sm">© 2026 Tvojton.online. Všetky práva vyhradené.</p>
            <div className="flex gap-4">
              <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">Domov</Link>
              <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
