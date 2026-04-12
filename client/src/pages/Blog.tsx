import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, ArrowRight, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { sk } from "date-fns/locale";

function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

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
              <Link href="/#features" className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">Funkcie</Link>
              <Link href="/#pricing" className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">Cenník</Link>
              <Link href="/#contact" className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">Kontakt</Link>
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

      {/* HERO */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container">
          <div className="max-w-2xl">
            <Badge className="bg-blue-50 text-blue-700 border-blue-100 mb-4">Blog</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Novinky a tipy z AI sveta</h1>
            <p className="text-gray-500 text-lg">
              Sleduj najnovšie trendy v oblasti umelej inteligencie, tipy na produktivitu a novinky z Tvojton.online.
            </p>
          </div>
        </div>
      </section>

      {/* BLOG POSTS */}
      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Zatiaľ žiadne články</h3>
              <p className="text-gray-400 mb-6">Prvé články budú čoskoro dostupné.</p>
              <Link href="/admin">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Pridať prvý článok
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const plainContent = stripHtml(post.content);
                const minutes = readingTime(plainContent);
                const excerpt = post.excerpt || plainContent.slice(0, 150) + (plainContent.length > 150 ? "..." : "");
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <article className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge className="bg-blue-50 text-blue-700 border-blue-100 text-xs">AI</Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {minutes} min čítania
                        </div>
                      </div>
                      <h2 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">{excerpt}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {post.publishedAt
                            ? format(new Date(post.publishedAt), "d. MMM yyyy", { locale: sk })
                            : format(new Date(post.createdAt), "d. MMM yyyy", { locale: sk })}
                        </div>
                        <span className="text-blue-600 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Čítať <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

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
