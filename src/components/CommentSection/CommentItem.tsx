// src/components/CommentSystem/CommentItem.tsx
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { RiDeleteBin6Line, RiReplyLine } from "react-icons/ri";
import { FiMoreVertical } from "react-icons/fi";
import { Comment } from "./comment.types";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onLike: (commentId: string, isCurrentlyLiked: boolean) => Promise<void>;
  onDeleteRequest: (commentId: string) => void;
  onReplySubmit: (text: string, parentId: string) => Promise<void>;
  level?: number;
  likedComments: Set<string>;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onLike,
  onDeleteRequest,
  onReplySubmit,
  level = 0,
  likedComments,
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
      console.error("Reply submission failed in CommentItem:", err);
      // Error is expected to be handled/displayed by the parent (CommentSection)
    } finally {
      setIsSubmittingReply(false);
    }
  };

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
      style={{ marginLeft: level > 0 ? `${level * 1}rem` : "0" }}
    >
      <div className="py-3">
        {comment.isDeleted ? (
          <div className="text-sub italic text-sm py-2">[deleted comment]</div>
        ) : (
          <div className="relative group">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-sm font-semibold text-dark-primary group-hover:text-secondary transition-colors duration-200">
                {comment.username || "User"}
              </p>
              <span className="text-xs text-sub flex-shrink-0 ml-2">
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </span>
            </div>

            <p className="text-sm text-dark-primary mb-2 break-words">
              {comment.text}
            </p>

            <div className="flex items-center mt-2 space-x-3 text-xs">
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

              {currentUserId && (
                <button
                  onClick={handleReplyClick}
                  className="text-sub hover:text-secondary flex items-center transition-colors duration-200"
                  title="Reply"
                >
                  <RiReplyLine size={16} className="mr-1" /> Reply
                </button>
              )}

              {isOwner && (
                <div className="relative ml-auto">
                  <button
                    onClick={() => setMenuVisible(!menuVisible)}
                    className="text-sub hover:text-dark-primary transition-colors duration-200 p-1 -m-1 rounded-full"
                    title="More options"
                  >
                    <FiMoreVertical size={16} />
                  </button>
                  {menuVisible && (
                    <div
                      className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-card border border-gray-600 focus:outline-none z-10 origin-top-right animate-fade-in"
                      role="menu"
                      aria-orientation="vertical"
                      onBlur={() =>
                        setTimeout(() => setMenuVisible(false), 150)
                      }
                    >
                      <div className="py-1" role="none">
                        <button
                          onClick={() => {
                            onDeleteRequest(comment._id);
                            setMenuVisible(false);
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
                    className={primaryButtonClasses}
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

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-1 space-y-1">
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

export default CommentItem;
