import React, { useState, useEffect, useCallback, useMemo } from "react"; // Added useMemo
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { RiDeleteBin6Line, RiReplyLine } from "react-icons/ri";
import { FiMoreVertical } from "react-icons/fi";

// Comment type (no changes needed here)
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

// --- Helper function to update comment state immutably ---
const updateCommentInTree = (
  comments: Comment[],
  commentId: string,
  updateFn: (comment: Comment) => Comment
): Comment[] => {
  return comments.map((comment) => {
    // Ensure replies exist for recursive call consistency
    const currentComment = { ...comment, replies: comment.replies || [] };

    if (currentComment._id === commentId) {
      return updateFn(currentComment); // Apply the update
    }

    // Recurse only if there are actual replies to traverse
    if (currentComment.replies.length > 0) {
      const updatedReplies = updateCommentInTree(
        currentComment.replies,
        commentId,
        updateFn
      );
      // Only return a new object if replies actually changed
      if (updatedReplies !== currentComment.replies) {
        return { ...currentComment, replies: updatedReplies };
      }
    }
    return comment; // Return original if no change down this path
  });
};

// --- Helper function to add reply immutably (MORE DEFENSIVE) ---
const addReplyToTree = (
  comments: Comment[], // Current level of comments/replies being checked
  parentId: string,
  newReply: Comment
): Comment[] => {
  return comments.map((comment) => {
    // 1. Ensure the current comment object consistently has a 'replies' array
    const currentComment = { ...comment, replies: comment.replies || [] };

    // 2. Check if this comment is the parent
    if (currentComment._id === parentId) {
      // Add the new reply to this comment's replies
      const updatedReplies = [...currentComment.replies, newReply].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      // Return a *new* comment object with the updated replies
      return { ...currentComment, replies: updatedReplies };
    }

    // 3. If not the parent, check if we need to recurse into its replies
    //    (Only recurse if there are replies to check)
    if (currentComment.replies.length > 0) {
      // Recursively try to add the reply within this comment's replies
      const updatedNestedReplies = addReplyToTree(
        currentComment.replies,
        parentId,
        newReply
      );

      // 4. If the recursive call resulted in a change (meaning the parent was found deeper)
      //    Return a *new* comment object incorporating the changed nested replies.
      if (updatedNestedReplies !== currentComment.replies) {
        // Check instance equality
        return { ...currentComment, replies: updatedNestedReplies };
      }
    }

    // 5. If this comment is not the parent, and the parent wasn't found in its replies (or it has no replies),
    //    return the comment object as it was (potentially with replies initialized to [] if it was missing).
    //    Returning the potentially modified `currentComment` ensures the `replies:[]` initialization persists.
    return currentComment; // Use currentComment which has guaranteed .replies
  });
};

// --- Comment Item Component (No changes needed here) ---
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
  // ... existing CommentItem code ...
  // Make sure it correctly accesses comment.replies (which should now always be an array)
  // Example check inside CommentItem render:
  // {comment.replies && comment.replies.length > 0 && (
  //   <div className="mt-2">
  //     {comment.replies.map((reply) => ( ... ))}
  //   </div>
  // )}
  // This existing check is fine.

  // --- Existing CommentItem component code ---
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");

  // Props are already destructured in the function arguments, so this block is unnecessary.

  const isOwner = currentUserId && comment.userId === currentUserId;
  const isLiked = likedComments.has(comment._id);

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
    setReplyText("");
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplySubmit(replyText, comment._id);
    setReplyText("");
    setShowReplyForm(false);
  };

  return (
    <div
      className={`border-b border-gray-600 py-2 ${
        level > 0 ? `ml-${level * 4} pl-4 border-l border-gray-700` : ""
      }`}
      style={{ marginLeft: `${level * 1.5}rem` }}
    >
      {comment.isDeleted ? (
        <div className="text-DFsecondary italic text-sm py-2">
          [deleted comment]
        </div>
      ) : (
        <div className="relative">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-semibold text-DFsecondary">
              {comment.username || "User"}
            </p>
            <span className="text-xs text-sub">
              {formatDistanceToNow(new Date(comment.createdAt))} ago
            </span>
          </div>
          <p className="text-DFprimary mb-1">{comment.text}</p>
          <div className="flex items-center mt-1 text-xs">
            <button
              onClick={() => onLike(comment._id, isLiked)}
              className="text-red flex items-center mr-3 hover:opacity-80 disabled:opacity-50"
              disabled={!currentUserId}
              title={
                !currentUserId ? "Login to like" : isLiked ? "Unlike" : "Like"
              }
            >
              {isLiked ? (
                <AiFillHeart className="text-red-500" />
              ) : (
                <AiOutlineHeart className="text-DFprimary" />
              )}
              <span className="ml-1">{comment.likes}</span>
            </button>
            {currentUserId && (
              <button
                onClick={handleReplyClick}
                className="text-DFprimary flex items-center mr-3 hover:text-orange500"
                title="Reply"
              >
                <RiReplyLine className="mr-1" /> Reply
              </button>
            )}
            {isOwner && (
              <div className="relative ml-auto">
                <button
                  onClick={() => setMenuVisible(!menuVisible)}
                  className="text-DFprimary hover:text-gray-400"
                  title="More options"
                >
                  <FiMoreVertical />
                </button>
                {menuVisible && (
                  <div
                    className="absolute right-0 mt-1 w-32 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="py-1" role="none">
                      <button
                        onClick={() => {
                          onDeleteRequest(comment._id);
                          setMenuVisible(false);
                        }}
                        className="text-red-500 flex items-center px-4 py-2 text-sm hover:bg-gray-800 w-full text-left"
                        role="menuitem"
                      >
                        <RiDeleteBin6Line className="mr-2" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {showReplyForm && currentUserId && (
            <form onSubmit={handleReplySubmit} className="mt-2 ml-4">
              <textarea
                placeholder={`Replying to ${comment.username}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="p-2 border rounded w-full text-black text-sm"
                rows={2}
              />
              <div className="flex justify-end mt-1 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-1 px-3 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange500 hover:bg-orange600 text-white p-1 px-3 rounded text-xs disabled:opacity-50"
                  disabled={!replyText.trim()}
                >
                  Reply
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      {/* Render Replies Recursively */}
      {/* This check should be safe now as comment.replies is guaranteed by addReplyToTree/updateCommentInTree */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
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

// --- Main Comment Section Component ---
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
  const [error, setError] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const storageKey = useMemo(
    () => `likedComments_${currentUserId}`,
    [currentUserId]
  );

  // --- Load/Save liked comments (no changes needed here) ---
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

  // --- Fetch Comments (no changes needed here) ---
  const fetchComments = useCallback(async () => {
    if (!betId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/comments/${betId}`
      );
      // IMPORTANT: Assume backend ALREADY provides `replies: []` even for comments with no replies.
      // If backend doesn't, we might need a recursive function here too to ensure it.
      // Let's assume backend's buildCommentTree works correctly for now.
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching:", err);
      setError("Failed load.");
    } finally {
      setIsLoading(false);
    }
  }, [betId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // --- Add Root Comment ---
  const handleAddRootComment = async () => {
    if (!newComment.trim() || !currentUserId) return;
    setError(null); // Clear previous errors
    try {
      const res = await axios.post("http://localhost:5000/api/comments", {
        betId,
        userId: currentUserId,
        text: newComment,
        parentId: null,
      });
      // **FIX:** Ensure the new root comment object has replies: []
      const newRootComment: Comment = { ...res.data, replies: [] };
      setComments([newRootComment, ...comments]); // Add to start
      setNewComment("");
    } catch (error) {
      console.error("Error add root:", error);
      setError("Failed post.");
    }
  };

  // --- Add Reply ---
  const handleAddReply = async (text: string, parentId: string) => {
    if (!text.trim() || !currentUserId) return;
    setError(null); // Clear previous errors
    try {
      const res = await axios.post("http://localhost:5000/api/comments", {
        betId,
        userId: currentUserId,
        text,
        parentId,
      });
      // **FIX:** Ensure the new reply object also has replies: [] for future nesting
      const newReply: Comment = { ...res.data, replies: [] };
      // Use the more defensive addReplyToTree
      setComments((prevComments) =>
        addReplyToTree(prevComments, parentId, newReply)
      );
    } catch (error) {
      console.error("Error add reply:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setError("Parent comment gone.");
        fetchComments(); // Refetch
      } else {
        setError("Failed reply.");
      }
    }
  };

  // --- Handle Like/Unlike (using defensive updateCommentInTree) ---
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
    setLikedComments(optimisticLikedComments); // Optimistic UI
    setError(null); // Clear previous errors

    try {
      const response = await axios.post(
        `http://localhost:5000/api/comments/${endpoint}/${commentId}`,
        { userId: currentUserId }
      );
      // Update using the defensive helper
      setComments((prevComments) =>
        updateCommentInTree(prevComments, commentId, (comment) => ({
          ...comment, // Spread the existing comment (which updateCommentInTree ensures has .replies)
          likes: response.data.likes,
        }))
      );
    } catch (error) {
      console.error(`Error ${endpoint}:`, error);
      setError(`Failed ${endpoint}.`);
      // Revert optimistic update
      setLikedComments((prevSet) => {
        /* ... revert logic ... */
        const revertedSet = new Set(prevSet);
        if (isCurrentlyLiked) {
          revertedSet.add(commentId);
        } else {
          revertedSet.delete(commentId);
        }
        return revertedSet;
      });
    }
  };

  // --- Delete Request (no change) ---
  const handleDeleteRequest = (commentId: string) => {
    /* ... */ setCommentToDelete(commentId);
    setShowConfirmation(true);
  };
  // --- Cancel Delete (no change) ---
  const cancelDeleteConfirmation = () => {
    /* ... */ setShowConfirmation(false);
    setCommentToDelete(null);
  };

  // --- Confirm Deletion (using defensive updateCommentInTree) ---
  const handleDeleteConfirm = async () => {
    if (!commentToDelete || !currentUserId) return;
    setError(null); // Clear previous errors
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/comments/${commentToDelete}`,
        { data: { userId: currentUserId } }
      );
      const deletedInfo = response.data.comment;
      // Use the defensive helper to update
      setComments((prevComments) =>
        updateCommentInTree(prevComments, commentToDelete, (comment) => ({
          ...comment, // Spread existing comment
          isDeleted: deletedInfo.isDeleted,
          text: deletedInfo.text,
          username: deletedInfo.username, // Or anonymize further if needed
          userId: null, // Anonymize
          // Keep likes/likedBy as returned by backend or reset them
          likes: deletedInfo.likes,
          likedBy: deletedInfo.likedBy,
        }))
      );
    } catch (error) {
      console.error("Error delete:", error);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setError("Not authorized.");
      } else {
        setError("Failed delete.");
      }
    } finally {
      /* ... reset state ... */ setCommentToDelete(null);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="p-4 bg-primary text-DFprimary rounded-lg mt-4">
      <h3 className="text-lg font-bold mb-3">Comments</h3>
      {/* Add Root Comment Form */}
      {/* ... existing form ... */}
      {currentUserId && (
        <div className="mb-4">
          <textarea
            /* ... */ value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddRootComment} /* ... */>
            {" "}
            Add Comment{" "}
          </button>
        </div>
      )}
      {!currentUserId && <p /* ... */>Please log in to comment.</p>}
      {error && <p className="text-red-500 my-2">{error}</p>}{" "}
      {/* Display errors */}
      {/* Display Comments */}
      {isLoading && <p>Loading comments...</p>}
      {!isLoading && !error && comments.length === 0 && (
        <p className="text-sm text-DFsecondary">No comments yet.</p>
      )}
      {!isLoading && ( // Render even if there was a fetch error, but maybe show partial data or just the error message
        <div>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment} // Pass the comment object from the state
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
      {/* Deletion Confirmation Modal */}
      {/* ... existing modal code ... */}
      {showConfirmation && (
        <div /* ... modal wrapper ... */>
          <div /* ... overlay ... */ onClick={cancelDeleteConfirmation}></div>
          <div /* ... modal panel ... */>
            {/* ... modal content (icon, text) ... */}
            <div className="bg-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {" "}
              /* ... */{" "}
            </div>
            {/* ... modal buttons ... */}
            <div className="bg-primary px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button onClick={handleDeleteConfirm} /* ... delete button ... */>
                {" "}
                Delete{" "}
              </button>
              <button
                onClick={cancelDeleteConfirmation} /* ... cancel button ... */
              >
                {" "}
                Cancel{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
