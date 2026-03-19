import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Bot, ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Agent() {
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

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Späť na hlavnú stránku
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Agent Status */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bot className="w-10 h-10 text-green-600" />
          </div>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium mb-4 border border-green-100">
            <Sparkles className="w-4 h-4" />
            AI agent je pripravený
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tvoj AI agent je online!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Prepnúť na plnú verziu alebo nám zanechaj kontakt pre bližšie informácie.
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6"
            onClick={() => window.open("https://seo-christine-helping-designers.trycloudflare.com", "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
            Otvoriť agenta v novom okne
          </Button>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Zaujíma ťa plná verzia?
            </h2>
            <p className="text-gray-500 text-sm">
              Zanechaj nám kontakt a ozveme sa ti s bližšími informáciami
            </p>
          </div>
          
          {formSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ďakujeme za registráciu!</h3>
              <p className="text-gray-600">Budeme ťa informovať o všetkom.</p>
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
                {submitContact.isPending ? "Odosielam..." : "Zaujíma ma plná verzia"}
              </Button>
              <p className="text-center text-xs text-gray-400">
                Tvoj email a telefón budeme používať len na informácie o Tvojton.online.
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
