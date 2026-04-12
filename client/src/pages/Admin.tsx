import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Bot,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ArrowLeft,
  FileText,
  Mail,
  LogOut,
  Save,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { sk } from "date-fns/locale";

type AdminView = "dashboard" | "blog-list" | "blog-new" | "blog-edit" | "contacts" | "login";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  status: "draft" | "published";
}

const emptyForm: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
  status: "draft",
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const ADMIN_USERNAME = "Jenifer";
const ADMIN_PASSWORD = "Vladko16";

export default function Admin() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [view, setView] = useState<AdminView>("login");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<BlogFormData>(emptyForm);
  const [adminLogin, setAdminLogin] = useState({ username: "", password: "" });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [, navigate] = useLocation();

  const utils = trpc.useUtils();

  const { data: posts, isLoading: postsLoading } = trpc.blog.adminList.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: contacts, isLoading: contactsLoading } = trpc.contact.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin" && view === "contacts",
  });

  const { data: editPost } = trpc.blog.adminById.useQuery(
    { id: editingId! },
    { enabled: !!editingId }
  );

  const createPost = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Článok bol vytvorený!");
      utils.blog.adminList.invalidate();
      setView("blog-list");
      setFormData(emptyForm);
    },
    onError: (e) => toast.error(e.message || "Chyba pri vytváraní článku"),
  });

  const updatePost = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Článok bol aktualizovaný!");
      utils.blog.adminList.invalidate();
      setView("blog-list");
      setEditingId(null);
      setFormData(emptyForm);
    },
    onError: (e) => toast.error(e.message || "Chyba pri aktualizácii"),
  });

  const deletePost = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Článok bol zmazaný.");
      utils.blog.adminList.invalidate();
    },
    onError: (e) => toast.error(e.message || "Chyba pri mazaní"),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Admin prihlásenie
  if (!isAdminLoggedIn) {
    const handleAdminLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (adminLogin.username === ADMIN_USERNAME && adminLogin.password === ADMIN_PASSWORD) {
        setIsAdminLoggedIn(true);
        setView("dashboard");
        setAdminLogin({ username: "", password: "" });
      } else {
        toast.error("Nesprávne meno alebo heslo");
      }
    };

    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center max-w-sm w-full mx-4">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Bot className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin panel</h1>
          <p className="text-gray-500 mb-6 text-sm">Prihlás sa pre prístup k správe obsahu.</p>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-1.5 block">Meno</Label>
              <Input
                id="username"
                type="text"
                value={adminLogin.username}
                onChange={(e) => setAdminLogin({ ...adminLogin, username: e.target.value })}
                placeholder="Zadaj meno"
                className="border-gray-200"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1.5 block">Heslo</Label>
              <Input
                id="password"
                type="password"
                value={adminLogin.password}
                onChange={(e) => setAdminLogin({ ...adminLogin, password: e.target.value })}
                placeholder="Zadaj heslo"
                className="border-gray-200"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Prihlásiť sa
            </Button>
          </form>
          <Link href="/">
            <Button variant="ghost" className="w-full mt-2 text-gray-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Späť na stránku
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center max-w-sm w-full mx-4">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Bot className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin panel</h1>
          <p className="text-gray-500 mb-6 text-sm">Prihlás sa pre prístup k správe obsahu.</p>
          <a href={getLoginUrl()}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Prihlásiť sa
            </Button>
          </a>
          <Link href="/">
            <Button variant="ghost" className="w-full mt-2 text-gray-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Späť na stránku
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Prístup zamietnutý</h1>
          <p className="text-gray-500 mb-6">Nemáš oprávnenie na prístup k admin panelu.</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Späť na stránku</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleStartEdit = (id: number) => {
    const post = posts?.find((p) => p.id === id);
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        metaTitle: post.metaTitle || "",
        metaDescription: post.metaDescription || "",
        ogImage: post.ogImage || "",
        status: post.status,
      });
      setEditingId(id);
      setView("blog-edit");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === "blog-edit" && editingId) {
      updatePost.mutate({ id: editingId, ...formData });
    } else {
      createPost.mutate(formData);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      metaTitle: prev.metaTitle || title,
    }));
  };

  const publishedCount = posts?.filter((p) => p.status === "published").length || 0;
  const draftCount = posts?.filter((p) => p.status === "draft").length || 0;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Admin Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">T</div>
                <span className="font-semibold text-gray-900 hidden sm:block">tvojton.online</span>
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-medium text-gray-600">Admin panel</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 hidden sm:block">Jenifer</span>
              <Button variant="ghost" size="sm" className="text-gray-500 gap-2" onClick={() => { setIsAdminLoggedIn(false); setAdminLogin({ username: "", password: "" }); }}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Odhlásiť</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* Sidebar + Content */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard", icon: <Bot className="w-4 h-4" /> },
                { id: "blog-list", label: "Blogy", icon: <FileText className="w-4 h-4" /> },
                { id: "contacts", label: "Kontakty", icon: <Mail className="w-4 h-4" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as AdminView)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    view === item.id || (item.id === "blog-list" && (view === "blog-new" || view === "blog-edit"))
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* DASHBOARD */}
            {view === "dashboard" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Publikované</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{publishedCount}</p>
                    <p className="text-xs text-gray-400 mt-1">blogových článkov</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Koncepty</span>
                      <Clock className="w-5 h-5 text-orange-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{draftCount}</p>
                    <p className="text-xs text-gray-400 mt-1">čakajúcich na publikáciu</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Kontakty</span>
                      <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">—</p>
                    <p className="text-xs text-gray-400 mt-1">registrácií</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button onClick={() => setView("blog-new")} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all text-left group">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                      <Plus className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Nový článok</h3>
                    <p className="text-sm text-gray-500">Vytvor nový blogový príspevok s SEO nastaveniami</p>
                  </button>
                  <button onClick={() => setView("contacts")} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all text-left group">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Kontaktné formuláre</h3>
                    <p className="text-sm text-gray-500">Zobraz registrácie z čakacej listiny</p>
                  </button>
                </div>
              </div>
            )}

            {/* BLOG LIST */}
            {view === "blog-list" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Blogové články</h1>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    onClick={() => { setFormData(emptyForm); setEditingId(null); setView("blog-new"); }}
                  >
                    <Plus className="w-4 h-4" />
                    Nový článok
                  </Button>
                </div>
                {postsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse h-16"></div>
                    ))}
                  </div>
                ) : !posts || posts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">Zatiaľ žiadne články</p>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                      onClick={() => { setFormData(emptyForm); setView("blog-new"); }}
                    >
                      <Plus className="w-4 h-4" />
                      Vytvoriť prvý článok
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Názov</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Stav</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Dátum</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Akcie</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {posts.map((post) => (
                          <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{post.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">/blog/{post.slug}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              {post.status === "published" ? (
                                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">Publikovaný</Badge>
                              ) : (
                                <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs">Koncept</Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">
                              {format(new Date(post.createdAt), "d. MMM yyyy", { locale: sk })}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                {post.status === "published" && (
                                  <Link href={`/blog/${post.slug}`}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                                  onClick={() => handleStartEdit(post.id)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                                  onClick={() => {
                                    if (confirm("Naozaj chceš zmazať tento článok?")) {
                                      deletePost.mutate({ id: post.id });
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* BLOG FORM (new / edit) */}
            {(view === "blog-new" || view === "blog-edit") && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-gray-500"
                    onClick={() => { setView("blog-list"); setEditingId(null); setFormData(emptyForm); }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Späť
                  </Button>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {view === "blog-edit" ? "Upraviť článok" : "Nový článok"}
                  </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-5">
                      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                        <h2 className="font-semibold text-gray-900">Obsah článku</h2>
                        <div className="space-y-1.5">
                          <Label htmlFor="title" className="text-sm font-medium text-gray-700">Nadpis článku *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Napr. Ako AI mení spôsob písania textov"
                            className="border-gray-200"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="slug" className="text-sm font-medium text-gray-700">
                            URL slug *
                            <span className="text-gray-400 font-normal ml-1">(len malé písmená, číslice, pomlčky)</span>
                          </Label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400 flex-shrink-0">/blog/</span>
                            <Input
                              id="slug"
                              value={formData.slug}
                              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                              placeholder="ako-ai-meni-sposob-pisania"
                              className="border-gray-200"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700">
                            Krátky popis <span className="text-gray-400 font-normal">(voliteľné)</span>
                          </Label>
                          <Textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="Krátky popis článku zobrazený v zozname blogov..."
                            className="border-gray-200 resize-none"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                            Obsah článku *
                            <span className="text-gray-400 font-normal ml-1">(HTML alebo čistý text)</span>
                          </Label>
                          <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="<h2>Úvod</h2><p>Text článku...</p>"
                            className="border-gray-200 font-mono text-sm"
                            rows={16}
                            required
                          />
                          <p className="text-xs text-gray-400">Môžeš použiť HTML tagy: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a&gt;, atď.</p>
                        </div>
                      </div>
                    </div>

                    {/* SEO sidebar */}
                    <div className="space-y-5">
                      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                        <h2 className="font-semibold text-gray-900">Publikovanie</h2>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">Stav</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(v) => setFormData({ ...formData, status: v as "draft" | "published" })}
                          >
                            <SelectTrigger className="border-gray-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Koncept</SelectItem>
                              <SelectItem value="published">Publikovaný</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            disabled={createPost.isPending || updatePost.isPending}
                          >
                            <Save className="w-4 h-4" />
                            {createPost.isPending || updatePost.isPending ? "Ukladám..." : "Uložiť"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-gray-200"
                            onClick={() => { setView("blog-list"); setEditingId(null); setFormData(emptyForm); }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                        <h2 className="font-semibold text-gray-900">SEO nastavenia</h2>
                        <div className="space-y-1.5">
                          <Label htmlFor="metaTitle" className="text-sm font-medium text-gray-700">
                            Meta Title
                            <span className="text-gray-400 font-normal ml-1">(max 60 znakov)</span>
                          </Label>
                          <Input
                            id="metaTitle"
                            value={formData.metaTitle}
                            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                            placeholder="SEO nadpis pre vyhľadávače"
                            className="border-gray-200 text-sm"
                            maxLength={60}
                          />
                          <p className="text-xs text-gray-400">{formData.metaTitle.length}/60 znakov</p>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="metaDesc" className="text-sm font-medium text-gray-700">
                            Meta Description
                            <span className="text-gray-400 font-normal ml-1">(max 160 znakov)</span>
                          </Label>
                          <Textarea
                            id="metaDesc"
                            value={formData.metaDescription}
                            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                            placeholder="Popis stránky pre vyhľadávače..."
                            className="border-gray-200 resize-none text-sm"
                            rows={3}
                            maxLength={160}
                          />
                          <p className="text-xs text-gray-400">{formData.metaDescription.length}/160 znakov</p>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="ogImage" className="text-sm font-medium text-gray-700">
                            OG Image URL
                            <span className="text-gray-400 font-normal ml-1">(voliteľné)</span>
                          </Label>
                          <Input
                            id="ogImage"
                            value={formData.ogImage}
                            onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                            placeholder="https://..."
                            className="border-gray-200 text-sm"
                          />
                        </div>

                        {/* SEO Preview */}
                        {(formData.metaTitle || formData.title) && (
                          <div className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                            <p className="text-xs font-medium text-gray-500 mb-2">Náhľad vo vyhľadávači</p>
                            <p className="text-blue-700 text-sm font-medium truncate">
                              {formData.metaTitle || formData.title}
                            </p>
                            <p className="text-green-700 text-xs">tvojton.online › blog › {formData.slug || "slug"}</p>
                            <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                              {formData.metaDescription || formData.excerpt || "Popis článku..."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* CONTACTS */}
            {view === "contacts" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Kontaktné formuláre</h1>
                {contactsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse h-16"></div>
                    ))}
                  </div>
                ) : !contacts || contacts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Zatiaľ žiadne registrácie</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Meno</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Plán</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Email odoslaný</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Dátum</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {contacts.map((c) => (
                          <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                            <td className="px-4 py-3">
                              <a href={`mailto:${c.email}`} className="text-sm text-blue-600 hover:underline">{c.email}</a>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <Badge className="bg-blue-50 text-blue-700 border-blue-100 text-xs capitalize">
                                {c.plan || "—"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              {c.emailSent ? (
                                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">Odoslaný</Badge>
                              ) : (
                                <Badge className="bg-gray-50 text-gray-500 border-gray-200 text-xs">Nie</Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">
                              {format(new Date(c.createdAt), "d. MMM yyyy HH:mm", { locale: sk })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
