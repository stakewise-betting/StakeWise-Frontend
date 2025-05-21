// src/components/CommentSystem/CommentSection.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiErrorWarningLine } from "react-icons/ri";

import { Comment } from "./comment.types";
import { updateCommentInTree, addReplyToTree } from "./comment.utils";
import CommentItem from "./CommentItem";
import ConfirmationModal from "./ConfirmationModal";

interface CommentSectionProps {
  betId: string;
  currentUserId?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  betId,
  currentUserId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const storageKey = useMemo(
    () => `likedComments_${currentUserId}`,
    [currentUserId]
  );

  useEffect(() => {
    if (!currentUserId) {
      setLikedComments(new Set());
      return;
    }
    try {
      const savedLikes = localStorage.getItem(storageKey);
      setLikedComments(
        savedLikes ? new Set(JSON.parse(savedLikes)) : new Set()
      );
    } catch (err) {
      console.error("Error loading liked comments from localStorage:", err);
      setLikedComments(new Set());
    }
  }, [currentUserId, storageKey]);

  useEffect(() => {
    if (!currentUserId) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(Array.from(likedComments))
      );
    } catch (err) {
      console.error("Error saving liked comments to localStorage:", err);
    }
  }, [likedComments, storageKey, currentUserId]);

  const fetchComments = useCallback(async () => {
    if (!betId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/comments/${betId}`
      );
      // Sort comments by creation date, newest first
      const sortedComments = (res.data as Comment[]).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setComments(sortedComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [betId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddRootComment = async () => {
    if (!newComment.trim() || !currentUserId || isPostingComment) return;
    setError(null);
    setIsPostingComment(true);
    try {
      const res = await axios.post("http://localhost:5000/api/comments", {
        betId,
        userId: currentUserId,
        text: newComment,
        parentId: null,
      });
      const newRootComment: Comment = { ...res.data, replies: [] };
      setComments((prev) =>
        [newRootComment, ...prev].sort(
          // Maintain sort order
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      setNewComment("");
    } catch (error) {
      console.error("Error adding root comment:", error);
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleAddReply = useCallback(
    async (text: string, parentId: string): Promise<void> => {
      if (!text.trim() || !currentUserId) {
        setError("Login and text are required to reply.");
        throw new Error("User not logged in or text empty");
      }
      setError(null);
      try {
        const res = await axios.post("http://localhost:5000/api/comments", {
          betId,
          userId: currentUserId,
          text,
          parentId,
        });
        const newReply: Comment = { ...res.data, replies: [] };
        setComments((prevComments) =>
          addReplyToTree(prevComments, parentId, newReply)
        );
      } catch (error) {
        console.error("Error adding reply:", error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setError(
            "Could not post reply: Parent comment may have been deleted."
          );
          fetchComments();
        } else {
          setError("Failed to post reply. Please try again.");
        }
        throw error;
      }
    },
    [betId, currentUserId, fetchComments]
  );

  const handleLikeToggle = async (
    commentId: string,
    isCurrentlyLiked: boolean
  ) => {
    if (!currentUserId) return;
    const endpoint = isCurrentlyLiked ? "unlike" : "like";
    const originalLikedComments = new Set(likedComments);

    // Optimistic update
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) newSet.delete(commentId);
      else newSet.add(commentId);
      return newSet;
    });
    setError(null);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/comments/${endpoint}/${commentId}`,
        { userId: currentUserId }
      );
      setComments((prevComments) =>
        updateCommentInTree(prevComments, commentId, (comment) => ({
          ...comment,
          likes: response.data.likes,
        }))
      );
    } catch (error) {
      console.error(`Error ${endpoint} comment:`, error);
      setError(`Failed to ${endpoint} comment.`);
      setLikedComments(originalLikedComments); // Revert on error
    }
  };

  const handleDeleteRequest = (commentId: string) => {
    setCommentToDelete(commentId);
    setShowConfirmation(true);
  };

  const cancelDeleteConfirmation = () => {
    if (isDeleting) return;
    setShowConfirmation(false);
    setCommentToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete || !currentUserId || isDeleting) return;
    setError(null);
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/comments/${commentToDelete}`,
        { data: { userId: currentUserId } }
      );
      const deletedInfo = response.data.comment;

      setComments((prevComments) =>
        updateCommentInTree(prevComments, commentToDelete, (comment) => ({
          ...comment,
          isDeleted: deletedInfo.isDeleted,
          text: deletedInfo.text,
          username: deletedInfo.username || "[deleted]",
          userId: null,
          likes: deletedInfo.likes,
          // Retain replies structure, backend should handle cascading soft deletes if necessary
        }))
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setError("You are not authorized to delete this comment.");
      } else {
        setError("Failed to delete comment. Please try again.");
      }
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
      setCommentToDelete(null);
    }
  };

  const baseButtonClasses = `
    inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
    text-sm font-semibold
    transition-all duration-300 ease-in-out relative overflow-hidden
    border focus:outline-none focus:ring-2 focus:ring-offset-2
    focus:ring-offset-card focus:ring-secondary/80
  `;

  const primaryButtonClasses = `
    ${baseButtonClasses}
    bg-secondary/90 border-secondary/90 text-white
    hover:bg-secondary hover:border-secondary
    hover:-translate-y-0.5 shadow-sm hover:shadow-md hover:shadow-secondary/30
    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
    disabled:shadow-none disabled:bg-secondary/50 disabled:border-secondary/50
  `;

  const dangerButtonClasses = `
    ${baseButtonClasses}
    bg-admin-danger/90 border-admin-danger/90 text-white
    hover:bg-admin-danger hover:border-admin-danger
    hover:-translate-y-0.5 shadow-sm hover:shadow-md hover:shadow-admin-danger/30
    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
    disabled:shadow-none disabled:bg-admin-danger/50 disabled:border-admin-danger/50
  `;

  const cancelButtonClasses = `
    ${baseButtonClasses}
    bg-transparent border-gray-500 text-sub
    hover:bg-gray-700/60 hover:text-dark-primary hover:border-gray-400
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    disabled:shadow-none disabled:bg-transparent
  `;

  return (
    <div className="bg-primary text-dark-primary rounded-lg mt-4 border border-gray-700/50 shadow-sm">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-dark-primary">
          Comments
        </h3>

        {currentUserId && (
          <div className="mb-5 p-4 bg-card rounded-lg border border-gray-700/60 shadow-inner">
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2.5 rounded-md bg-primary border border-gray-600 focus:ring-1 focus:ring-secondary focus:border-secondary text-dark-primary placeholder-sub text-sm resize-none transition-colors duration-200"
              rows={3}
              aria-label="New comment text"
              disabled={isPostingComment}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddRootComment}
                className={primaryButtonClasses}
                disabled={!newComment.trim() || isPostingComment}
              >
                {isPostingComment && (
                  <AiOutlineLoading3Quarters
                    className="animate-spin mr-1.5"
                    size={16}
                  />
                )}
                {isPostingComment ? "Posting..." : "Add Comment"}
              </button>
            </div>
          </div>
        )}
        {!currentUserId && (
          <p className="text-sm text-sub my-4 p-3 bg-card rounded-md border border-gray-700/60 text-center">
            Please log in to comment or reply.
          </p>
        )}

        {error && (
          <div className="my-4 p-3 bg-admin-danger/10 border border-admin-danger/30 rounded-md text-sm text-red-400 flex items-center gap-2 animate-fade-in">
            <RiErrorWarningLine size={18} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-5">
          {isLoading && (
            <div className="flex items-center justify-center py-6 text-sub">
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              Loading comments...
            </div>
          )}

          {!isLoading && comments.length === 0 && !error && (
            <p className="text-sm text-sub text-center py-6">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}

          {!isLoading && comments.length > 0 && (
            <div className="space-y-4 border-t border-gray-700/60 pt-4">
              {comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  currentUserId={currentUserId}
                  onLike={handleLikeToggle}
                  onDeleteRequest={handleDeleteRequest}
                  onReplySubmit={handleAddReply}
                  level={0}
                  likedComments={likedComments}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={cancelDeleteConfirmation}
        onConfirm={handleDeleteConfirm}
        isConfirming={isDeleting}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmButtonText="Delete"
        dangerButtonClasses={dangerButtonClasses}
        cancelButtonClasses={cancelButtonClasses}
      />
    </div>
  );
};

export default CommentSection;
