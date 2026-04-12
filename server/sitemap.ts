import { Router } from "express";
import { getAllBlogPosts } from "./db";

export const sitemapRouter = Router();

sitemapRouter.get("/sitemap.xml", async (req, res) => {
  try {
    const posts = await getAllBlogPosts(true);
    const baseUrl = "https://tvojton.online";

    type SitemapUrl = { url: string; priority: string; changefreq: string; lastmod?: string };

    const staticPages: SitemapUrl[] = [
      { url: "/", priority: "1.0", changefreq: "weekly" },
      { url: "/blog", priority: "0.9", changefreq: "daily" },
    ];

    const blogUrls: SitemapUrl[] = posts.map((post) => ({
      url: `/blog/${post.slug}`,
      priority: "0.8",
      changefreq: "monthly",
      lastmod: post.updatedAt ? new Date(post.updatedAt).toISOString().split("T")[0] : undefined,
    }));

    const allUrls: SitemapUrl[] = [...staticPages, ...blogUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (error) {
    console.error("[Sitemap] Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});
