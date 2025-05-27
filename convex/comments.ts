import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    content: v.string(),
    authorId: v.id("users"),
    postId: v.id("posts"),
    parentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let depth = 0;

    // Calculate depth and update parent's child count
    if (args.parentId) {
      const parent = await ctx.db.get(args.parentId);
      if (!parent) throw new Error("Parent comment not found");
      
      depth = parent.depth + 1;
      
      // Update parent's child count
      await ctx.db.patch(args.parentId, {
        childCount: parent.childCount + 1,
      });
    }

    // Create the comment
    const commentId = await ctx.db.insert("comments", {
      content: args.content,
      authorId: args.authorId,
      postId: args.postId,
      parentId: args.parentId,
      depth,
      score: 1, // Start with author's upvote
      upvotes: 1,
      downvotes: 0,
      childCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    // Update post's comment count
    const post = await ctx.db.get(args.postId);
    if (post) {
      await ctx.db.patch(args.postId, {
        commentCount: post.commentCount + 1,
      });
    }

    return commentId;
  },
});

export const getByPost = query({
  args: {
    postId: v.id("posts"),
    sortBy: v.optional(v.union(v.literal("best"), v.literal("new"), v.literal("top"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const sortBy = args.sortBy ?? "best";

    // Get top-level comments first (parentId is undefined/null)
    let topLevelComments;
    if (sortBy === "new") {
      topLevelComments = await ctx.db
        .query("comments")
        .withIndex("by_post_parent", (q) => 
          q.eq("postId", args.postId).eq("parentId", undefined)
        )
        .order("desc")
        .take(limit);
    } else {
      topLevelComments = await ctx.db
        .query("comments")
        .withIndex("by_post_parent", (q) => 
          q.eq("postId", args.postId).eq("parentId", undefined)
        )
        .filter((q) => q.eq(q.field("parentId"), undefined))
        .order("desc")
        .take(limit);
    }

    return topLevelComments;
  },
});

export const getChildren = query({
  args: {
    parentId: v.id("comments"),
    sortBy: v.optional(v.union(v.literal("best"), v.literal("new"), v.literal("top"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const sortBy = args.sortBy ?? "best";

    if (sortBy === "new") {
      return await ctx.db
        .query("comments")
        .withIndex("by_parent_time", (q) => q.eq("parentId", args.parentId))
        .order("desc")
        .take(limit);
    } else {
      return await ctx.db
        .query("comments")
        .withIndex("by_parent_score", (q) => q.eq("parentId", args.parentId))
        .order("desc")
        .take(limit);
    }
  },
});

export const getThread = query({
  args: {
    commentId: v.id("comments"),
    depth: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const maxDepth = args.depth ?? 5;
    const rootComment = await ctx.db.get(args.commentId);
    if (!rootComment) return null;

    const thread = [rootComment];
    await buildThread(ctx, args.commentId, thread, 1, maxDepth);
    
    return thread;
  },
});

export const getById = query({
  args: { id: v.id("comments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("comments"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      content: args.content,
      isEdited: true,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("comments") },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.id);
    if (!comment) throw new Error("Comment not found");

    // Update parent's child count if this comment has a parent
    if (comment.parentId) {
      const parent = await ctx.db.get(comment.parentId);
      if (parent) {
        await ctx.db.patch(comment.parentId, {
          childCount: Math.max(0, parent.childCount - 1),
        });
      }
    }

    // Update post's comment count
    const post = await ctx.db.get(comment.postId);
    if (post) {
      await ctx.db.patch(comment.postId, {
        commentCount: Math.max(0, post.commentCount - 1),
      });
    }

    return await ctx.db.patch(args.id, {
      isRemoved: true,
      content: "[removed]",
      updatedAt: Date.now(),
    });
  },
});

export const getByUser = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 25;
    
    return await ctx.db
      .query("comments")
      .withIndex("by_author", (q) => q.eq("authorId", args.userId))
      .order("desc")
      .take(limit);
  },
});

async function buildThread(
  ctx: any,
  parentId: Id<"comments">,
  thread: Doc<"comments">[],
  currentDepth: number,
  maxDepth: number
): Promise<void> {
  if (currentDepth >= maxDepth) return;

  const children = await ctx.db
    .query("comments")
    .withIndex("by_parent_score", (q: any) => q.eq("parentId", parentId))
    .order("desc")
    .collect();

  for (const child of children) {
    thread.push(child);
    await buildThread(ctx, child._id, thread, currentDepth + 1, maxDepth);
  }
}
