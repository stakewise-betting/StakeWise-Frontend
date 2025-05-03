import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import {
  RiDeleteBin6Line,
  RiReplyLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import { FiMoreVertical } from "react-icons/fi";

// --- Comment Type (no changes) ---
type Comment = {
  _id: string;
  username: string;
  text: string;
  createdAt: string;
  likes: number;
  likedByUser?: boolean;
  userId: string | null;
  parentId: string | null;
  replies: Comment[]; // Nested replies
  isDeleted?: boolean;
};

// --- Helper function to update comment state immutably (no changes) ---
const updateCommentInTree = (
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

// --- Helper function to add reply immutably (no changes) ---
const addReplyToTree = (
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

// --- Comment Item Component (REDESIGNED) ---
const CommentItem = ({
  comment,
  currentUserId,
  onLike,
  onDeleteRequest,
  onReplySubmit,
  level = 0,
  likedComments,
}: {
  comment: Comment;
  currentUserId?: string;
  onLike: (commentId: string, isCurrentlyLiked: boolean) => Promise<void>;
  onDeleteRequest: (commentId: string) => void;
  onReplySubmit: (text: string, parentId: string) => Promise<void>;
  level?: number;
  likedComments: Set<string>;
}) => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const isOwner = currentUserId && comment.userId === currentUserId;
  const isLiked = likedComments.has(comment._id);

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
    setReplyText("");
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;
    setIsSubmittingReply(true);
    try {
      await onReplySubmit(replyText, comment._id);
      setReplyText("");
      setShowReplyForm(false);
    } catch (err) {
      // Error handled in parent component
      console.error("Reply submission failed in CommentItem:", err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Base button classes (similar to admin examples)
  const baseButtonClasses = `
    inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md
    text-xs font-medium
    transition-all duration-200 ease-in-out focus:outline-none
    focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-secondary/80
  `;

  const secondaryButtonClasses = `
    ${baseButtonClasses}
    bg-gray-600 hover:bg-gray-500 text-white
  `;

  const primaryButtonClasses = `
    ${baseButtonClasses}
    bg-secondary/80 hover:bg-secondary text-white
    disabled:bg-secondary/40 disabled:cursor-not-allowed
  `;

  return (
    <div
      className={`
        transition-colors duration-200 ease-in-out
        ${level > 0 ? "pl-4 md:pl-6 border-l border-gray-700/80" : ""}
      `}
      // Apply dynamic margin using inline style for precise control based on level
      style={{ marginLeft: level > 0 ? `${level * 1}rem` : "0" }}
    >
      <div className="py-3">
        {comment.isDeleted ? (
          <div className="text-sub italic text-sm py-2">[deleted comment]</div>
        ) : (
          <div className="relative group">
            {/* Comment Header */}
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-sm font-semibold text-dark-primary group-hover:text-secondary transition-colors duration-200">
                {comment.username || "User"}
              </p>
              <span className="text-xs text-sub flex-shrink-0 ml-2">
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </span>
            </div>

            {/* Comment Text */}
            <p className="text-sm text-dark-primary mb-2 break-words">
              {comment.text}
            </p>

            {/* Comment Actions */}
            <div className="flex items-center mt-2 space-x-3 text-xs">
              {/* Like Button */}
              <button
                onClick={() => onLike(comment._id, isLiked)}
                className={`flex items-center transition-colors duration-200 ${
                  isLiked
                    ? "text-red-500 hover:text-red-400"
                    : "text-sub hover:text-red-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={!currentUserId}
                title={
                  !currentUserId ? "Login to like" : isLiked ? "Unlike" : "Like"
                }
              >
                {isLiked ? (
                  <AiFillHeart size={16} className="mr-1" />
                ) : (
                  <AiOutlineHeart size={16} className="mr-1" />
                )}
                <span className="font-medium">{comment.likes}</span>
              </button>

              {/* Reply Button */}
              {currentUserId && (
                <button
                  onClick={handleReplyClick}
                  className="text-sub hover:text-secondary flex items-center transition-colors duration-200"
                  title="Reply"
                >
                  <RiReplyLine size={16} className="mr-1" /> Reply
                </button>
              )}

              {/* More Options Button & Menu (Owner Only) */}
              {isOwner && (
                <div className="relative ml-auto">
                  <button
                    onClick={() => setMenuVisible(!menuVisible)}
                    className="text-sub hover:text-dark-primary transition-colors duration-200 p-1 -m-1 rounded-full" // Add padding+negative margin for larger click area
                    title="More options"
                  >
                    <FiMoreVertical size={16} />
                  </button>
                  {menuVisible && (
                    <div
                      className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-card border border-gray-600 focus:outline-none z-10 origin-top-right animate-fade-in"
                      role="menu"
                      aria-orientation="vertical"
                      // Close menu on blur/click outside (simple approach)
                      onBlur={() =>
                        setTimeout(() => setMenuVisible(false), 150)
                      } // Timeout to allow click inside
                    >
                      <div className="py-1" role="none">
                        <button
                          onClick={() => {
                            onDeleteRequest(comment._id);
                            setMenuVisible(false); // Close menu immediately
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-admin-danger hover:bg-primary hover:text-admin-danger/80 transition-colors duration-150"
                          role="menuitem"
                        >
                          <RiDeleteBin6Line className="mr-2" size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Reply Form */}
            {showReplyForm && currentUserId && (
              <form
                onSubmit={handleReplySubmit}
                className="mt-3 pt-3 border-t border-gray-700/50 animate-fade-in"
              >
                <textarea
                  placeholder={`Replying to ${comment.username}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-2 rounded-md bg-primary border border-gray-600 focus:ring-1 focus:ring-secondary focus:border-secondary text-dark-primary placeholder-sub text-sm resize-none transition-colors duration-200"
                  rows={2}
                  aria-label="Reply text"
                  disabled={isSubmittingReply}
                />
                <div className="flex justify-end items-center mt-2 space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className={`${secondaryButtonClasses} disabled:opacity-70`}
                    disabled={isSubmittingReply}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={primaryButtonClasses} // Uses defined primary style
                    disabled={!replyText.trim() || isSubmittingReply}
                  >
                    {isSubmittingReply ? (
                      <AiOutlineLoading3Quarters
                        className="animate-spin mr-1"
                        size={14}
                      />
                    ) : null}
                    {isSubmittingReply ? "Replying..." : "Reply"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Render Replies Recursively */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-1 space-y-1">
          {" "}
          {/* Reduced margin top */}
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              currentUserId={currentUserId}
              onLike={onLike}
              onDeleteRequest={onDeleteRequest}
              onReplySubmit={onReplySubmit}
              level={level + 1}
              likedComments={likedComments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Comment Section Component (REDESIGNED) ---
const CommentSection = ({
  betId,
  currentUserId,
}: {
  betId: string;
  currentUserId?: string;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete

  const storageKey = useMemo(
    () => `likedComments_${currentUserId}`,
    [currentUserId]
  );

  // --- Load/Save liked comments (no changes) ---
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
      console.error("Err load likes:", err);
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
      console.error("Err save likes:", err);
    }
  }, [likedComments, storageKey, currentUserId]);

  // --- Fetch Comments (no changes) ---
  const fetchComments = useCallback(async () => {
    if (!betId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/comments/${betId}`
      );
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching:", err);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [betId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // --- Add Root Comment ---
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
      // Add to start, ensuring sort order is maintained if backend doesn't guarantee it
      setComments((prev) =>
        [newRootComment, ...prev].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      setNewComment("");
    } catch (error) {
      console.error("Error add root:", error);
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsPostingComment(false);
    }
  };

  // --- Add Reply (now returns Promise for better loading state in child) ---
  const handleAddReply = useCallback(
    async (text: string, parentId: string): Promise<void> => {
      // Wrap in useCallback since it's passed down
      if (!text.trim() || !currentUserId) {
        throw new Error("User not logged in or text empty"); // Let caller handle UI
      }
      setError(null); // Clear previous section-wide errors

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
        // No need to return anything on success, void is fine
      } catch (error) {
        console.error("Error add reply:", error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setError(
            "Could not post reply: Parent comment may have been deleted."
          );
          fetchComments(); // Refetch to get latest state
        } else {
          setError("Failed to post reply. Please try again.");
        }
        throw error; // Re-throw error so child component knows it failed
      }
    },
    [betId, currentUserId, fetchComments] // Dependencies for useCallback
  );

  // --- Handle Like/Unlike (no major changes, uses helper) ---
  const handleLikeToggle = async (
    commentId: string,
    isCurrentlyLiked: boolean
  ) => {
    if (!currentUserId) return;
    const endpoint = isCurrentlyLiked ? "unlike" : "like";
    const optimisticLikedComments = new Set(likedComments);
    if (isCurrentlyLiked) {
      optimisticLikedComments.delete(commentId);
    } else {
      optimisticLikedComments.add(commentId);
    }
    setLikedComments(optimisticLikedComments);
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
      console.error(`Error ${endpoint}:`, error);
      setError(`Failed to ${endpoint} comment.`);
      // Revert optimistic update
      setLikedComments((prevSet) => {
        const revertedSet = new Set(prevSet);
        if (isCurrentlyLiked) {
          // If it was liked, the optimistic update removed it, so add it back
          revertedSet.add(commentId);
        } else {
          // If it was not liked, the optimistic update added it, so delete it
          revertedSet.delete(commentId);
        }
        return revertedSet;
      });
    }
  };

  // --- Delete Request (no change) ---
  const handleDeleteRequest = (commentId: string) => {
    setCommentToDelete(commentId);
    setShowConfirmation(true);
  };
  // --- Cancel Delete (no change) ---
  const cancelDeleteConfirmation = () => {
    if (isDeleting) return; // Prevent closing while deletion is in progress
    setShowConfirmation(false);
    setCommentToDelete(null);
  };

  // --- Confirm Deletion (uses helper, added loading state) ---
  const handleDeleteConfirm = async () => {
    if (!commentToDelete || !currentUserId || isDeleting) return;
    setError(null);
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/comments/${commentToDelete}`,
        { data: { userId: currentUserId } } // Ensure userId is in data for DELETE
      );
      const deletedInfo = response.data.comment; // Assume backend returns updated comment state

      // Update using the helper
      setComments((prevComments) =>
        updateCommentInTree(prevComments, commentToDelete, (comment) => ({
          ...comment,
          isDeleted: deletedInfo.isDeleted,
          text: deletedInfo.text, // Keep text as "[deleted]" or similar from backend
          username: "[deleted]", // Anonymize username
          userId: null, // Anonymize userId
          likes: deletedInfo.likes, // Keep likes or reset as per backend logic
          // Keep replies structure, they might still be visible if not deleted themselves
        }))
      );
    } catch (error) {
      console.error("Error delete:", error);
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

  // --- Button Styles (for root comment form and modal) ---
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

        {/* Add Root Comment Form */}
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
                className={primaryButtonClasses} // Use defined primary style
                disabled={!newComment.trim() || isPostingComment}
              >
                {isPostingComment ? (
                  <AiOutlineLoading3Quarters
                    className="animate-spin mr-1.5"
                    size={16}
                  />
                ) : null}
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

        {/* Error Display */}
        {error && (
          <div className="my-4 p-3 bg-admin-danger/10 border border-admin-danger/30 rounded-md text-sm text-red-400 flex items-center gap-2 animate-fade-in">
            <RiErrorWarningLine size={18} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Comments List Area */}
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
            // Add subtle dividers between top-level comments
            <div className="space-y-4 border-t border-gray-700/60 pt-4">
              {comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  currentUserId={currentUserId}
                  onLike={handleLikeToggle}
                  onDeleteRequest={handleDeleteRequest}
                  onReplySubmit={handleAddReply} // Pass down the memoized callback
                  level={0}
                  likedComments={likedComments}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      {showConfirmation && (
        // Overlay
        <div
          className="fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 flex items-center justify-center"
          onClick={cancelDeleteConfirmation} // Close on overlay click
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Panel */}
          <div
            className="bg-card rounded-lg shadow-xl max-w-sm w-full overflow-hidden border border-gray-700 m-4 animate-appear"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="p-5 sm:p-6">
              <div className="sm:flex sm:items-start">
                {/* Icon */}
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-admin-danger/10 sm:mx-0 sm:h-10 sm:w-10">
                  <RiErrorWarningLine
                    className="h-6 w-6 text-admin-danger"
                    aria-hidden="true"
                  />
                </div>
                {/* Text Content */}
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-semibold text-dark-primary"
                    id="modal-title"
                  >
                    Delete Comment
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-sub">
                      Are you sure you want to delete this comment? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Buttons Area */}
            <div className="bg-primary/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-700/60">
              <button
                type="button"
                className={`${dangerButtonClasses} w-full sm:ml-3 sm:w-auto`} // Use defined danger style
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <AiOutlineLoading3Quarters
                    className="animate-spin mr-1.5"
                    size={16}
                  />
                ) : null}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                className={`${cancelButtonClasses} mt-3 w-full sm:mt-0 sm:w-auto`} // Use defined cancel style
                onClick={cancelDeleteConfirmation}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection; // Keep only one export default
