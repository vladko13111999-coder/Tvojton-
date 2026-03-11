import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createBlogPost,
  createContactSubmission,
  deleteBlogPost,
  getAllBlogPosts,
  getAllContactSubmissions,
  getBlogPostById,
  getBlogPostBySlug,
  markEmailSent,
  updateBlogPost,
} from "./db";
import { sendContactNotification } from "./email";

// Admin-only middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ---- Contact Router ----
const contactRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().max(320),
        plan: z.string().optional(),
        message: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Save to database
      await createContactSubmission({
        name: input.name,
        email: input.email,
        plan: input.plan,
        message: input.message,
        emailSent: false,
      });

      // Send email notification
      const emailSent = await sendContactNotification({
        name: input.name,
        email: input.email,
        plan: input.plan,
        message: input.message,
      });

      // Update emailSent status if email was sent
      if (emailSent) {
        // Get the last inserted record and mark as sent
        const submissions = await getAllContactSubmissions();
        const latest = submissions.find((s) => s.email === input.email && s.name === input.name);
        if (latest) {
          await markEmailSent(latest.id);
        }
      }

      return { success: true, emailSent };
    }),

  // Admin: list all submissions
  list: adminProcedure.query(async () => {
    return getAllContactSubmissions();
  }),
});

// ---- Blog Router ----
const blogRouter = router({
  // Public: list published posts
  list: publicProcedure.query(async () => {
    return getAllBlogPosts(true);
  }),

  // Public: get post by slug
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await getBlogPostBySlug(input.slug);
      if (!post || post.status !== "published") {
        throw new TRPCError({ code: "NOT_FOUND", message: "Blog post not found" });
      }
      return post;
    }),

  // Admin: list all posts (including drafts)
  adminList: adminProcedure.query(async () => {
    return getAllBlogPosts(false);
  }),

  // Admin: get post by ID
  adminById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await getBlogPostById(input.id);
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),

  // Admin: create post
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, "Slug môže obsahovať len malé písmená, číslice a pomlčky"),
        excerpt: z.string().max(500).optional(),
        content: z.string().min(1),
        metaTitle: z.string().max(255).optional(),
        metaDescription: z.string().max(500).optional(),
        ogImage: z.string().max(500).optional(),
        status: z.enum(["draft", "published"]).default("draft"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await createBlogPost({
        ...input,
        authorId: ctx.user.id,
        publishedAt: input.status === "published" ? new Date() : undefined,
      });
      return { success: true };
    }),

  // Admin: update post
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
        excerpt: z.string().max(500).optional(),
        content: z.string().min(1).optional(),
        metaTitle: z.string().max(255).optional(),
        metaDescription: z.string().max(500).optional(),
        ogImage: z.string().max(500).optional(),
        status: z.enum(["draft", "published"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = { ...data };
      if (data.status === "published") {
        const existing = await getBlogPostById(id);
        if (existing && !existing.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }
      await updateBlogPost(id, updateData);
      return { success: true };
    }),

  // Admin: delete post
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteBlogPost(input.id);
      return { success: true };
    }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  contact: contactRouter,
  blog: blogRouter,
});

export type AppRouter = typeof appRouter;
