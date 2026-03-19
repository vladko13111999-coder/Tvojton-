import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  FileText,
  Megaphone,
  Video,
  CheckCircle,
  Zap,
  Gift,
  Check,
  Facebook,
  Music2,
  Sparkles,
  Bot,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    website: "",
    plan: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setFormSubmitted(true);
      setFormData({ name: "", email: "", telephone: "", website: "", plan: "", message: "" });
      toast.success("Ďakujeme! Budeme ťa informovať.");
    },
    onError: (err) => {
      toast.error("Nastala chyba. Skús to znova.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Vyplň meno a email.");
      return;
    }
    submitContact.mutate(formData);
  };

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
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                T
              </div>
              <span className="font-semibold text-gray-900">tvojton.online</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <button onClick={() => scrollTo("home")} className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">Domov</button>
              <button onClick={() => scrollTo("features")} className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">Funkcie</button>
              <button onClick={() => scrollTo("pricing")} className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">Cenník</button>
              <button onClick={() => scrollTo("contact")} className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">Kontakt</button>
              <Link href="/blog" className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">Blog</Link>
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

      {/* HERO SECTION */}
      <section id="home" className="py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium mb-6 border border-blue-100">
                <Sparkles className="w-4 h-4" />
                Tvoj osobný AI asistent
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Tvoj osobný AI asistent do vrecka
              </h1>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Pomôže ti s textami, reklamami, vyhľadávaním a čoskoro aj s videami. Vyskúšaj zadarmo.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/agent">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6"
                  >
                    Vyskúšať agenta
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 px-6"
                  onClick={() => window.open("http://80.15.7.37:8888", "_blank")}
                >
                  Pozri demo
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Bezplatne na skúšku
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Bez kreditnej karty
                </span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="hero-gradient-card rounded-2xl p-8 w-full max-w-sm shadow-2xl">
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Bot className="w-12 h-12 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-semibold text-xl">AI Asistent</h3>
                    <p className="text-white/80 text-sm mt-1">Vždy dostupný, vždy pripravený</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Čo všetko vie urobiť?</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Tvoj AI asistent je vybavený množstvom funkcií, ktoré ti pomôžu s každodennými úlohami.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Písanie textov</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Generovanie článkov, emailov, príspevkov na sociálne siete a ďalších textov v sekundách.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
              <Badge className="absolute top-4 right-4 bg-orange-100 text-orange-700 border-orange-200 text-xs">Čoskoro</Badge>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Megaphone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Tvorba reklám</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Stačí zadať URL produktu a AI vytvorí hotovú reklamu optimalizovanú na konverzie.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
              <Badge className="absolute top-4 right-4 bg-orange-100 text-orange-700 border-orange-200 text-xs">Čoskoro</Badge>
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Čoskoro: Videá</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Generovanie videoklipov z fotiek a hudby. Funkcia bude dostupná čoskoro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ako to funguje?</h2>
            <p className="text-gray-500 text-lg">Tri jednoduché kroky a máš hotový výsledok.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-blue-100"></div>
            {[
              {
                num: "1",
                icon: <CheckCircle className="w-8 h-8 text-white" />,
                title: "Zadáš úlohu",
                desc: "Jednoducho napíšeš, čo potrebuješ. Môže to byť text, reklama, alebo čokoľvek iné.",
              },
              {
                num: "2",
                icon: <Zap className="w-8 h-8 text-white" />,
                title: "AI pracuje na pozadí",
                desc: "Náš inteligentný asistent spracúva tvoju úlohu a generuje výsledok v reálnom čase.",
              },
              {
                num: "3",
                icon: <Gift className="w-8 h-8 text-white" />,
                title: "Dostaneš hotový výsledok",
                desc: "Výsledok je hneď pripravený na použitie. Môžeš ho upraviť alebo použiť ako je.",
              },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                    {step.num}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Jednoduché a transparentné ceny</h2>
            <p className="text-gray-500 text-lg">Vyber si plán, ktorý ti vyhovuje. Prvý mesiac so zľavou.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 text-xl mb-1">Free</h3>
              <p className="text-gray-500 text-sm mb-6">Perfektné na skúšanie</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-5xl font-bold text-gray-900">0</span>
                <span className="text-gray-500 mb-2">zadarmo</span>
              </div>
              <Button variant="outline" className="w-full mb-6 border-gray-200" onClick={() => scrollTo("contact")}>
                Vyskúšaj zadarmo
              </Button>
              <ul className="space-y-3">
                {["Základné funkcie", "Obmedzený počet úloh (5/mesiac)", "Štandardné spracovanie", "Email podpora"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Basic - highlighted */}
            <div className="border-2 border-blue-600 rounded-2xl p-6 bg-white shadow-lg relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white border-0 px-4">
                Najobľúbenejší
              </Badge>
              <h3 className="font-bold text-gray-900 text-xl mb-1">Basic</h3>
              <p className="text-gray-500 text-sm mb-6">Pre aktívnych používateľov</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-5xl font-bold text-gray-900">9</span>
                <span className="text-gray-500 mb-2">€/mesiac</span>
              </div>
              <Button className="w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => scrollTo("contact")}>
                Začať s Basic
              </Button>
              <ul className="space-y-3">
                {["Neobmedzené úlohy", "Prioritné spracovanie", "Všetky základné funkcie", "Prioritná email podpora", "História úloh"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Premium */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 text-xl mb-1">Premium</h3>
              <p className="text-gray-500 text-sm mb-6">Pre profesionálov</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-5xl font-bold text-gray-900">15</span>
                <span className="text-gray-500 mb-2">€/mesiac</span>
              </div>
              <Button variant="outline" className="w-full mb-6 border-gray-200" onClick={() => scrollTo("contact")}>
                Prejsť na Premium
              </Button>
              <ul className="space-y-3">
                {["Všetko z Basic plánu", "Generovanie videí", "Pokročilá tvorba reklám", "Prioritná podpora", "API prístup", "Vlastné šablóny"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2.5 rounded-xl text-sm">
              <span>💡</span>
              <span><strong>Tip:</strong> Prvý mesiac ľubovoľného plánu so zľavou 50%</span>
            </div>
            <p className="text-gray-400 text-sm mt-3">Bez dlhodobého záväzku. Zrušiť môžeš kedykoľvek.</p>
          </div>
        </div>
      </section>

      {/* CONTACT / WAITLIST FORM */}
      <section id="contact" className="py-20 bg-[#f8fafc]">
        <div className="container">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Daj mi vedieť, keď bude agent pripravený
                </h2>
                <p className="text-gray-500">Buď medzi prvými, ktorí budú môcť používať Tvojton.online</p>
              </div>
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Ďakujeme za registráciu!</h3>
                  <p className="text-gray-500 text-sm">Budeme ťa informovať, keď bude agent pripravený.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Meno a priezvisko</Label>
                      <Input
                        id="name"
                        placeholder="Ján Varga"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="border-gray-200"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jan@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border-gray-200"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="telephone" className="text-sm font-medium text-gray-700">Telefónne číslo</Label>
                      <Input
                        id="telephone"
                        type="tel"
                        placeholder="+421 900 123 456"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        className="border-gray-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="website" className="text-sm font-medium text-gray-700">Web stránka <span className="text-gray-400">(voliteľné)</span></Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://www.example.com"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="border-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Ktorý plán ťa zaujíma?</Label>
                    <Select value={formData.plan} onValueChange={(v) => setFormData({ ...formData, plan: v })}>
                      <SelectTrigger className="border-gray-200">
                        <SelectValue placeholder="Zatiaľ neviem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unknown">Zatiaľ neviem</SelectItem>
                        <SelectItem value="free">Free - Zadarmo</SelectItem>
                        <SelectItem value="basic">Basic - 9€/mesiac</SelectItem>
                        <SelectItem value="premium">Premium - 15€/mesiac</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Poznámky <span className="text-gray-400">(voliteľné)</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Napr. Potrebujem pomôcť s písaním marketingových textov..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="border-gray-200 resize-none"
                      rows={3}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
                    disabled={submitContact.isPending}
                  >
                    {submitContact.isPending ? "Odosielam..." : "Chcem byť medzi prvými"}
                  </Button>
                  <p className="text-center text-xs text-gray-400">
                    Tvoj email a telefón budeme používať len na informácie o Tvojton.online.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f172a] text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">T</div>
                <span className="font-semibold">tvojton.online</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tvoj osobný AI asistent dostupný 24/7.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">O nás</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tvojton.online je moderný AI asistent, ktorý pomáha ľuďom a podnikom s každodennými úlohami. Naším cieľom je sprístupniť AI technológiu všetkým.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Rýchle odkazy</h4>
              <ul className="space-y-2">
                {[
                  { label: "Domov", id: "home" },
                  { label: "Funkcie", id: "features" },
                  { label: "Cenník", id: "pricing" },
                  { label: "Kontakt", id: "contact" },
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollTo(link.id)}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Kontakt</h4>
              <a href="mailto:hello@tvojton.online" className="text-gray-400 hover:text-white text-sm transition-colors block mb-4">
                hello@tvojton.online
              </a>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                  <Music2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2026 Tvojton.online. Všetky práva vyhradené.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">Ochrana osobných údajov</Link>
              <Link href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">Podmienky použitia</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
