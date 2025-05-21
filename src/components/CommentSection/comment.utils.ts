// src/components/CommentSystem/comment.utils.ts
import { Comment } from "./comment.types";

export const updateCommentInTree = (
  comments: Comment[],
  commentId: string,
  updateFn: (comment: Comment) => Comment
): Comment[] => {
  return comments.map((comment) => {
    const currentComment = { ...comment, replies: comment.replies || [] };
    if (currentComment._id === commentId) {
      return updateFn(currentComment);
    }
    if (currentComment.replies.length > 0) {
      const updatedReplies = updateCommentInTree(
        currentComment.replies,
        commentId,
        updateFn
      );
      if (updatedReplies !== currentComment.replies) {
        return { ...currentComment, replies: updatedReplies };
      }
    }
    return comment;
  });
};

export const addReplyToTree = (
  comments: Comment[],
  parentId: string,
  newReply: Comment
): Comment[] => {
  return comments.map((comment) => {
    const currentComment = { ...comment, replies: comment.replies || [] };
    if (currentComment._id === parentId) {
      const updatedReplies = [...currentComment.replies, newReply].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      return { ...currentComment, replies: updatedReplies };
    }
    if (currentComment.replies.length > 0) {
      const updatedNestedReplies = addReplyToTree(
        currentComment.replies,
        parentId,
        newReply
      );
      if (updatedNestedReplies !== currentComment.replies) {
        return { ...currentComment, replies: updatedNestedReplies };
      }
    }
    return currentComment;
  });
};