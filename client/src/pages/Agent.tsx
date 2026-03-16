import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Bot, ArrowLeft } from "lucide-react";

export default function Agent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("https://formspree.io/f/xreyyqro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
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
      <main className="max-w-2xl mx-auto px-4 py-16">
        {/* Agent Status */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bot className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI agent nie je momentálne spustený
          </h1>
          <p className="text-lg text-gray-600">
            Zanechaj nám kontakt a ozveme sa ti, keď bude agent pripravený.
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {formSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ďakujeme!</h3>
              <p className="text-gray-600">Budeme sa ti ozývať čoskoro.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium text-gray-700">
                  Meno a priezvisko
                </Label>
                <Input
                  id="name"
                  placeholder="Ján Varga"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jan@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-base font-medium text-gray-700">
                  Správa <span className="text-gray-400">(nepovinné)</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Povedz nám, na čo chceš agenta používať..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="resize-none"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
              >
                Odoslať
              </Button>

              <p className="text-center text-sm text-gray-400">
                Tvoj email použijeme len na kontaktovanie ohľadom agenta.
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
