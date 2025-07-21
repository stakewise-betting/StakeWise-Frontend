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
    inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl
    text-sm font-semibold
    transition-all duration-300 ease-in-out relative overflow-hidden
    border focus:outline-none focus:ring-2 focus:ring-offset-2
    focus:ring-offset-card focus:ring-[#E27625]/50
  `;

  const primaryButtonClasses = `
    ${baseButtonClasses}
    bg-gradient-to-r from-[#E27625] to-[#F59E0B] border-[#E27625] text-white
    hover:from-[#F59E0B] hover:to-[#E27625] hover:border-[#F59E0B]
    hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-[#E27625]/30
    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
    disabled:shadow-none disabled:from-[#E27625]/50 disabled:to-[#F59E0B]/50
  `;

  const dangerButtonClasses = `
    ${baseButtonClasses}
    bg-gradient-to-r from-[#EF4444] to-[#DC2626] border-[#EF4444] text-white
    hover:from-[#DC2626] hover:to-[#EF4444] hover:border-[#DC2626]
    hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-[#EF4444]/30
    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
    disabled:shadow-none disabled:from-[#EF4444]/50 disabled:to-[#DC2626]/50
  `;

  const cancelButtonClasses = `
    ${baseButtonClasses}
    bg-gradient-to-r from-[#525266] to-[#6B7280] border-[#525266] text-white
    hover:from-[#6B7280] hover:to-[#525266] hover:border-[#6B7280]
    hover:scale-105 shadow-lg
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    disabled:shadow-none
  `;

  return (
    <div className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] rounded-xl mt-6 border border-[#404153] shadow-xl">
      <div className="p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold mb-6 bg-gradient-to-r from-white to-[#E5E5E5] bg-clip-text text-transparent flex items-center gap-3">
          <div className="w-2 h-2 bg-[#E27625] rounded-full"></div>
          Comments
        </h3>

        {currentUserId && (
          <div className="mb-8 p-6 bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl border border-[#525266] shadow-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                Share your thoughts
              </label>
              <textarea
                placeholder="Add a thoughtful comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-4 rounded-xl bg-gradient-to-br from-[#1C1C27] to-[#252538] border border-[#525266] focus:ring-2 focus:ring-[#E27625] focus:border-[#E27625] text-white placeholder-[#6B7280] text-sm resize-none transition-all duration-300 hover:border-[#6B7280]"
                rows={4}
                aria-label="New comment text"
                disabled={isPostingComment}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddRootComment}
                className={`${primaryButtonClasses} shadow-lg shadow-[#E27625]/20`}
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
          <div className="mb-8 p-6 bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl border border-[#525266] shadow-lg text-center">
            <div className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-white mb-2">
              Join the Conversation
            </h4>
            <p className="text-[#A1A1AA] text-sm">
              Please log in to comment and engage with the community.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#EF4444]/10 to-[#DC2626]/10 border border-[#EF4444]/30 rounded-xl text-sm text-[#FCA5A5] flex items-center gap-3 shadow-lg">
            <div className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] rounded-full p-2 flex-shrink-0">
              <RiErrorWarningLine size={18} className="text-white" />
            </div>
            <div>
              <p className="font-medium">Something went wrong</p>
              <p className="text-[#A1A1AA] text-xs mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="mt-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12 bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl border border-[#525266]">
              <div className="relative">
                <AiOutlineLoading3Quarters
                  className="animate-spin mr-3 text-[#E27625]"
                  size={24}
                />
                <div className="absolute inset-0 border-2 border-[#E27625]/20 rounded-full animate-pulse"></div>
              </div>
              <span className="text-[#A1A1AA] text-lg">
                Loading comments...
              </span>
            </div>
          )}

          {!isLoading && comments.length === 0 && !error && (
            <div className="text-center py-16 bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl border border-[#525266] shadow-lg">
              <div className="bg-gradient-to-r from-[#525266] to-[#6B7280] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-[#A1A1AA]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                No Comments Yet
              </h4>
              <p className="text-[#A1A1AA]">
                Be the first to share your thoughts!
              </p>
            </div>
          )}

          {!isLoading && comments.length > 0 && (
            <div className="bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl border border-[#525266] shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  <h4 className="text-lg font-semibold text-white">
                    {comments.length} Comment{comments.length !== 1 ? "s" : ""}
                  </h4>
                </div>
                <div className="space-y-6">
                  {comments.map((comment, index) => (
                    <div
                      key={comment._id}
                      className={
                        index > 0 ? "border-t border-[#525266] pt-6" : ""
                      }
                    >
                      <CommentItem
                        comment={comment}
                        currentUserId={currentUserId}
                        onLike={handleLikeToggle}
                        onDeleteRequest={handleDeleteRequest}
                        onReplySubmit={handleAddReply}
                        level={0}
                        likedComments={likedComments}
                      />
                    </div>
                  ))}
                </div>
              </div>
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
