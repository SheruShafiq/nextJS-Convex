import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    content: v.optional(v.string()),
    url: v.optional(v.string()),
    type: v.union(v.literal("text"), v.literal("link"), v.literal("image")),
    authorId: v.id("users"),
    subreddit: v.string(),
    isNsfw: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db.insert("posts", {
      ...args,
      score: 1, // Start with author's upvote
      upvotes: 1,
      downvotes: 0,
      commentCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySubreddit = query({
  args: {
    subreddit: v.string(),
    sortBy: v.optional(v.union(v.literal("hot"), v.literal("new"), v.literal("top"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 25;
    const sortBy = args.sortBy ?? "hot";

    let posts;
    if (sortBy === "new") {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_subreddit_time", (q) => q.eq("subreddit", args.subreddit))
        .order("desc")
        .take(limit);
    } else if (sortBy === "top") {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_subreddit_score", (q) => q.eq("subreddit", args.subreddit))
        .order("desc")
        .take(limit);
    } else {
      // Hot algorithm - combine score and time
      posts = await ctx.db
        .query("posts")
        .withIndex("by_subreddit_score", (q) => q.eq("subreddit", args.subreddit))
        .order("desc")
        .take(limit * 2); // Get more to apply hot algorithm
      
      const now = Date.now();
      posts = posts
        .map(post => ({
          ...post,
          hotScore: calculateHotScore(post.score, post.createdAt, now)
        }))
        .sort((a, b) => b.hotScore - a.hotScore)
        .slice(0, limit);
    }

    return posts;
  },
});

export const getFrontPage = query({
  args: {
    sortBy: v.optional(v.union(v.literal("hot"), v.literal("new"), v.literal("top"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 25;
    const sortBy = args.sortBy ?? "hot";

    let posts;
    if (sortBy === "new") {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_time")
        .order("desc")
        .take(limit);
    } else if (sortBy === "top") {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_score")
        .order("desc")
        .take(limit);
    } else {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_score")
        .order("desc")
        .take(limit * 2);
      
      const now = Date.now();
      posts = posts
        .map(post => ({
          ...post,
          hotScore: calculateHotScore(post.score, post.createdAt, now)
        }))
        .sort((a, b) => b.hotScore - a.hotScore)
        .slice(0, limit);
    }

    return posts;
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    content: v.optional(v.string()),
    isStickied: v.optional(v.boolean()),
    isLocked: v.optional(v.boolean()),
    isNsfw: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      isRemoved: true,
      updatedAt: Date.now(),
    });
  },
});

export const incrementCommentCount = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    
    return await ctx.db.patch(args.postId, {
      commentCount: post.commentCount + 1,
    });
  },
});

export const decrementCommentCount = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    
    return await ctx.db.patch(args.postId, {
      commentCount: Math.max(0, post.commentCount - 1),
    });
  },
});

function calculateHotScore(score: number, createdAt: number, now: number): number {
  const ageHours = (now - createdAt) / (1000 * 60 * 60);
  return score / Math.pow(ageHours + 2, 1.8);
}
