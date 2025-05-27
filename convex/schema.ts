import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        username: v.string(),
        email: v.string(),
        displayName: v.optional(v.string()),
        bio: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        karma: v.number(),
        isAdmin: v.optional(v.boolean()),
        isBanned: v.optional(v.boolean()),
        createdAt: v.number(),
    })
        .index("by_username", ["username"])
        .index("by_email", ["email"])
        .index("by_karma", ["karma"]),

    posts: defineTable({
        title: v.string(),
        content: v.optional(v.string()),
        url: v.optional(v.string()),
        type: v.union(v.literal("text"), v.literal("link"), v.literal("image")),
        authorId: v.id("users"),
        subreddit: v.string(),
        score: v.number(),
        upvotes: v.number(),
        downvotes: v.number(),
        commentCount: v.number(),
        isStickied: v.optional(v.boolean()),
        isLocked: v.optional(v.boolean()),
        isNsfw: v.optional(v.boolean()),
        isRemoved: v.optional(v.boolean()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_subreddit", ["subreddit"])
        .index("by_author", ["authorId"])
        .index("by_score", ["score"])
        .index("by_subreddit_score", ["subreddit", "score"])
        .index("by_subreddit_time", ["subreddit", "createdAt"])
        .index("by_time", ["createdAt"]),

    comments: defineTable({
        content: v.string(),
        authorId: v.id("users"),
        postId: v.id("posts"),
        parentId: v.optional(v.id("comments")), // null for top-level comments
        depth: v.number(), // 0 for top-level, 1 for replies, etc.
        score: v.number(),
        upvotes: v.number(),
        downvotes: v.number(),
        childCount: v.number(), // number of direct children
        isEdited: v.optional(v.boolean()),
        isRemoved: v.optional(v.boolean()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_post", ["postId"])
        .index("by_parent", ["parentId"])
        .index("by_post_parent", ["postId", "parentId"])
        .index("by_parent_score", ["parentId", "score"])
        .index("by_parent_time", ["parentId", "createdAt"])
        .index("by_author", ["authorId"]),

    votes: defineTable({
        userId: v.id("users"),
        targetId: v.union(v.id("posts"), v.id("comments")),
        targetType: v.union(v.literal("post"), v.literal("comment")),
        value: v.union(v.literal(1), v.literal(-1)), // 1 for upvote, -1 for downvote
        createdAt: v.number(),
    })
        .index("by_user_target", ["userId", "targetId"])
        .index("by_target", ["targetId"]),

    subreddits: defineTable({
        name: v.string(),
        displayName: v.string(),
        description: v.optional(v.string()),
        rules: v.optional(v.array(v.string())),
        moderatorIds: v.array(v.id("users")),
        subscriberCount: v.number(),
        isPrivate: v.optional(v.boolean()),
        isNsfw: v.optional(v.boolean()),
        createdAt: v.number(),
    })
        .index("by_name", ["name"])
        .index("by_subscriber_count", ["subscriberCount"]),

    subscriptions: defineTable({
        userId: v.id("users"),
        subreddit: v.string(),
        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_subreddit", ["subreddit"])
        .index("by_user_subreddit", ["userId", "subreddit"]),
});