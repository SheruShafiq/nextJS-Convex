import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const vote = mutation({
  args: {
    userId: v.id("users"),
    targetId: v.union(v.id("posts"), v.id("comments")),
    targetType: v.union(v.literal("post"), v.literal("comment")),
    value: v.union(v.literal(1), v.literal(-1), v.literal(0)), // 0 to remove vote
  },
  handler: async (ctx, args) => {
    const { userId, targetId, targetType, value } = args;

    // Check for existing vote
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user_target", (q) => 
        q.eq("userId", userId).eq("targetId", targetId)
      )
      .first();

    let oldValue = 0;
    if (existingVote) {
      oldValue = existingVote.value;
    }

    // Calculate score change
    const scoreChange = value - oldValue;

    // Update or create vote
    if (value === 0 && existingVote) {
      // Remove vote
      await ctx.db.delete(existingVote._id);
    } else if (existingVote) {
      // Update existing vote
      await ctx.db.patch(existingVote._id, {
        value: value as 1 | -1,
      });
    } else if (value !== 0) {
      // Create new vote
      await ctx.db.insert("votes", {
        userId,
        targetId,
        targetType,
        value: value as 1 | -1,
        createdAt: Date.now(),
      });
    }

    // Update target's score
    if (targetType === "post") {
      await updatePostScore(ctx, targetId as Id<"posts">, scoreChange);
    } else {
      await updateCommentScore(ctx, targetId as Id<"comments">, scoreChange);
    }

    return { success: true, scoreChange };
  },
});

export const getUserVote = query({
  args: {
    userId: v.id("users"),
    targetId: v.union(v.id("posts"), v.id("comments")),
  },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query("votes")
      .withIndex("by_user_target", (q) => 
        q.eq("userId", args.userId).eq("targetId", args.targetId)
      )
      .first();

    return vote?.value ?? 0;
  },
});

export const getVotesByTarget = query({
  args: {
    targetId: v.union(v.id("posts"), v.id("comments")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    
    return await ctx.db
      .query("votes")
      .withIndex("by_target", (q) => q.eq("targetId", args.targetId))
      .take(limit);
  },
});

export const getVotesByUser = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    return await ctx.db
      .query("votes")
      .withIndex("by_user_target", (q) => q.eq("userId", args.userId))
      .take(limit);
  },
});

async function updatePostScore(ctx: any, postId: Id<"posts">, scoreChange: number) {
  const post = await ctx.db.get(postId);
  if (!post) return;

  const newScore = post.score + scoreChange;
  let upvotes = post.upvotes;
  let downvotes = post.downvotes;

  if (scoreChange > 0) {
    upvotes += scoreChange;
  } else if (scoreChange < 0) {
    downvotes += Math.abs(scoreChange);
  }

  await ctx.db.patch(postId, {
    score: newScore,
    upvotes,
    downvotes,
  });
}

async function updateCommentScore(ctx: any, commentId: Id<"comments">, scoreChange: number) {
  const comment = await ctx.db.get(commentId);
  if (!comment) return;

  const newScore = comment.score + scoreChange;
  let upvotes = comment.upvotes;
  let downvotes = comment.downvotes;

  if (scoreChange > 0) {
    upvotes += scoreChange;
  } else if (scoreChange < 0) {
    downvotes += Math.abs(scoreChange);
  }

  await ctx.db.patch(commentId, {
    score: newScore,
    upvotes,
    downvotes,
  });
}
