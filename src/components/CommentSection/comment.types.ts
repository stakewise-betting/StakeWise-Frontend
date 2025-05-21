// src/components/CommentSystem/comment.types.ts
export type Comment = {
    _id: string;
    username: string;
    text: string;
    createdAt: string;
    likes: number;
    likedByUser?: boolean; // Note: This field was in your original type but not actively used for like status.
                           // The `likedComments` Set in CommentSection handles this.
    userId: string | null;
    parentId: string | null;
    replies: Comment[]; // Nested replies
    isDeleted?: boolean;
  };