import { Doc, Id } from "../convex/_generated/dataModel";

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  karma: number;
  posts?: string[];
  upvotedPosts?: string[];
  downVotedPosts?: string[];
  reportedPosts?: string[];
  isAdmin?: boolean;
  isBanned?: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  resource: string;
  description: string;
  upvotes: number;
  downvotes: number;
  reports: number;
  categoryID: string;
  comments: Comment[];
  dateCreated: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
  depth: number;
  score: number;
  upvotes: number;
  downvotes: number;
  childCount: number;
  isEdited?: boolean;
  isRemoved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  subscriberCount: number;
  isPrivate?: boolean;
  isNsfw?: boolean;
}

export interface fetchPostsPaginatedProps {
  onSuccess: (data: any) => void;
  onError: (error: errorProps) => void;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface paginatedPostsMetaDataType {
  first: string;
  prev: string;
  next: string;
  last: string;
}

// Convex document types
export type ConvexUser = Doc<"users">;
export type ConvexPost = Doc<"posts">;
export type ConvexComment = Doc<"comments">;
export type ConvexSubreddit = Doc<"subreddits">;
export type ConvexVote = Doc<"votes">;




export type RowData = { col1: string; col2: string };

export type ExcelLog = {
  id?: string;
  rows: RowData[];
  dateCreated: string;
};

export type Report = {
  id: string;
  postID: string;
  authorID: string;
  reason: string;
  dateCreated: string;
  dateModified: string;
  dateDeleted: string;
};

export type fetchPostsProps = {
  onSuccess: (posts: Post[]) => void;
  onError: (errorProps: errorProps) => void;
};

export type PaginatedPostsResponse = {
  posts: Post[];
  metadata: {
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
  };
};


export type standardFetchByIDProps = {
  onSuccess: (post: Post) => void;
  onError: (error: any) => void;
  id: string;
};
export type createPostProps = {
  title: string;
  resource: string;
  description: string;
  categoryID: string;
  authorID: string;
  onSuccess: (post: Post) => void;
  onError: (error: any) => void;
};
export type errorProps = {
  id: string;
  userFriendlyMessage: string;
  errorMessage: string;
  error: Error;
};


export type VoteField =
  | "likes"
  | "dislikes"
  | "upvotes"
  | "downvotes"
  | "reports";
export type createUserProps = {
  username: string;
  password: string;
  displayName: string;
  onSuccess: (user: User) => void;
  onError: (error: any) => void;
};
export type PatchUserProps = {
  userID: string;
  field: keyof User;
  newValue: string[];
  onSuccess: (user: User) => void;
  onError: (error: any) => void;
};

export type loginUserProps = {
  username: string;
  password: string;
  onSuccess: (user: User) => void;
  onError: (error: any) => void;
};

export type LoginUserResponse = {
  users: User[];
};

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}
