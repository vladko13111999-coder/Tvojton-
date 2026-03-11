import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock DB and email modules
vi.mock("./db", () => ({
  createContactSubmission: vi.fn().mockResolvedValue({}),
  getAllContactSubmissions: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "Ján Varga",
      email: "jan@example.com",
      plan: "basic",
      message: "Test správa",
      emailSent: true,
      createdAt: new Date(),
    },
  ]),
  markEmailSent: vi.fn().mockResolvedValue({}),
  getAllBlogPosts: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: "Testovací článok",
      slug: "testovaci-clanok",
      excerpt: "Krátky popis",
      content: "<p>Obsah článku</p>",
      metaTitle: "Testovací článok | SEO",
      metaDescription: "Meta popis článku",
      ogImage: null,
      status: "published",
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: 1,
    },
  ]),
  getBlogPostBySlug: vi.fn().mockImplementation(async (slug: string) => {
    if (slug === "testovaci-clanok") {
      return {
        id: 1,
        title: "Testovací článok",
        slug: "testovaci-clanok",
        excerpt: "Krátky popis",
        content: "<p>Obsah článku</p>",
        metaTitle: "Testovací článok | SEO",
        metaDescription: "Meta popis článku",
        ogImage: null,
        status: "published",
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 1,
      };
    }
    return undefined;
  }),
  getBlogPostById: vi.fn().mockResolvedValue(null),
  createBlogPost: vi.fn().mockResolvedValue({}),
  updateBlogPost: vi.fn().mockResolvedValue({}),
  deleteBlogPost: vi.fn().mockResolvedValue({}),
}));

vi.mock("./email", () => ({
  sendContactNotification: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@tvojton.online",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ---- Contact Tests ----
describe("contact.submit", () => {
  it("submits contact form with valid data", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.contact.submit({
      name: "Ján Varga",
      email: "jan@example.com",
      plan: "basic",
      message: "Potrebujem pomoc s textami",
    });
    expect(result.success).toBe(true);
  });

  it("submits contact form without optional fields", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.contact.submit({
      name: "Mária Nováková",
      email: "maria@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.contact.submit({ name: "Test", email: "not-an-email" })
    ).rejects.toThrow();
  });

  it("requires admin role for listing contacts", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.contact.list()).rejects.toThrow();
  });

  it("allows admin to list contacts", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const contacts = await caller.contact.list();
    expect(Array.isArray(contacts)).toBe(true);
    expect(contacts.length).toBeGreaterThan(0);
  });
});

// ---- Blog Tests ----
describe("blog.list", () => {
  it("returns published blog posts for public users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const posts = await caller.blog.list();
    expect(Array.isArray(posts)).toBe(true);
  });

  it("returns a blog post by slug", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const post = await caller.blog.bySlug({ slug: "testovaci-clanok" });
    expect(post.title).toBe("Testovací článok");
    expect(post.slug).toBe("testovaci-clanok");
  });

  it("throws NOT_FOUND for non-existent slug", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.blog.bySlug({ slug: "neexistujuci-clanok" })).rejects.toThrow();
  });
});

describe("blog admin procedures", () => {
  it("requires admin role for adminList", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.blog.adminList()).rejects.toThrow();
  });

  it("allows admin to list all posts", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const posts = await caller.blog.adminList();
    expect(Array.isArray(posts)).toBe(true);
  });

  it("allows admin to create a blog post", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.blog.create({
      title: "Nový testovací článok",
      slug: "novy-testovaci-clanok",
      content: "<p>Obsah nového článku</p>",
      status: "draft",
    });
    expect(result.success).toBe(true);
  });

  it("rejects slug with invalid characters", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.blog.create({
        title: "Test",
        slug: "Invalid Slug With Spaces!",
        content: "<p>Content</p>",
        status: "draft",
      })
    ).rejects.toThrow();
  });

  it("allows admin to delete a blog post", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.blog.delete({ id: 1 });
    expect(result.success).toBe(true);
  });
});
