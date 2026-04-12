import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const sampleBlog = {
  title: "Ako AI mení spôsob písania textov v roku 2026",
  slug: "ako-ai-meni-sposob-pisania-textov",
  excerpt: "Objavte, ako umelá inteligencia revolučne mení spôsob, akým píšeme texty, tvoria sa reklamy a generujú sa obsah.",
  content: "<h2>Úvod do AI písania</h2><p>Umelá inteligencia sa stala neoddeliteľnou súčasťou moderného písania. V roku 2026 už nie je otázkou, či budete AI používať, ale ako ju efektívne zaintegruješ do svojho pracovného procesu.</p><h2>Hlavné výhody AI pri písaní</h2><p>AI asistenti ako Tvojton.online ponúkajú niekoľko kľúčových výhod:</p><ul><li><strong>Rýchlosť:</strong> Vygeneruj kvalitný obsah v minútach</li><li><strong>Konzistencia:</strong> Udržuj jednotný tón a štýl</li><li><strong>Kreatívnosť:</strong> Získaj nové nápady a perspektívy</li><li><strong>SEO optimalizácia:</strong> Automaticky optimalizuj texty</li></ul><h2>Záver</h2><p>Ak chceš zostať konkurencieschopný, musíš sa naučiť AI efektívne používať.</p>",
  metaTitle: "Ako AI mení spôsob písania textov | Tvojton.online",
  metaDescription: "Objavte, ako AI revolučne mení písanie textov. Praktické tipy a stratégie pre efektívne používanie AI.",
  ogImage: null,
  status: "published",
  publishedAt: new Date(),
  authorId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function seed() {
  try {
    const query = `INSERT INTO blog_posts (title, slug, excerpt, content, metaTitle, metaDescription, ogImage, status, publishedAt, authorId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    await connection.execute(query, [
      sampleBlog.title,
      sampleBlog.slug,
      sampleBlog.excerpt,
      sampleBlog.content,
      sampleBlog.metaTitle,
      sampleBlog.metaDescription,
      sampleBlog.ogImage,
      sampleBlog.status,
      sampleBlog.publishedAt,
      sampleBlog.authorId,
      sampleBlog.createdAt,
      sampleBlog.updatedAt,
    ]);
    
    console.log("✅ Blog článok bol úspešne vložený do databázy");
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Chyba pri vkladaní článku:", error.message);
    await connection.end();
    process.exit(1);
  }
}

seed();
