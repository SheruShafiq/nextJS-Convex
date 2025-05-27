import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if username or email already exists
    const existingUsername = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const existingEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingEmail) {
      throw new Error("Email already exists");
    }

    return await ctx.db.insert("users", {
      ...args,
      karma: 1, // Start with 1 karma
      createdAt: Date.now(),
    });
  },
});

export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const updateProfile = mutation({
  args: {
    id: v.id("users"),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const updateKarma = mutation({
  args: {
    userId: v.id("users"),
    change: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    return await ctx.db.patch(args.userId, {
      karma: Math.max(0, user.karma + args.change),
    });
  },
});

export const getTopUsers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 25;
    
    return await ctx.db
      .query("users")
      .withIndex("by_karma")
      .order("desc")
      .take(limit);
  },
});

export const searchUsers = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const searchTerm = args.query.toLowerCase();

    const users = await ctx.db.query("users").collect();
    
    return users
      .filter(user => 
        user.username.toLowerCase().includes(searchTerm) ||
        (user.displayName && user.displayName.toLowerCase().includes(searchTerm))
      )
      .slice(0, limit);
  },
});

export const banUser = mutation({
  args: {
    userId: v.id("users"),
    isBanned: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.userId, {
      isBanned: args.isBanned,
    });
  },
});

export const setAdmin = mutation({
  args: {
    userId: v.id("users"),
    isAdmin: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.userId, {
      isAdmin: args.isAdmin,
    });
  },
});
