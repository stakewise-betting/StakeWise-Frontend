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
    inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg
    text-xs font-semibold
    transition-all duration-300 ease-in-out focus:outline-none
    focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-[#E27625]/50
  `;

  const secondaryButtonClasses = `
    ${baseButtonClasses}
    bg-gradient-to-r from-[#525266] to-[#6B7280] hover:from-[#6B7280] hover:to-[#525266] text-white
    hover:scale-105 shadow-lg
  `;

  const primaryButtonClasses = `
    ${baseButtonClasses}
    bg-gradient-to-r from-[#E27625] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#E27625] text-white
    hover:scale-105 shadow-lg shadow-[#E27625]/20
    disabled:from-[#E27625]/40 disabled:to-[#F59E0B]/40 disabled:cursor-not-allowed disabled:transform-none
  `;

  return (
    <div
      className={`
        bg-gradient-to-br from-[#1C1C27] to-[#252538] rounded-xl p-6 transition-all duration-300 hover:shadow-lg group
        ${
          level > 0
            ? "ml-8 border-l-4 border-[#E27625]/30 bg-gradient-to-br from-[#252538] to-[#2A2A3E]"
            : ""
        }
      `}
    >
      <div>
        {comment.isDeleted ? (
          <div className="text-[#6B7280] italic text-sm py-4 text-center bg-gradient-to-r from-[#333447] to-[#404153] rounded-lg">
            [Comment has been deleted]
          </div>
        ) : (
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold text-sm">
                  {(comment.username || "U")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-[#E27625] transition-colors duration-300">
                    {comment.username || "User"}
                  </p>
                  <span className="text-xs text-[#A1A1AA]">
                    {formatDistanceToNow(new Date(comment.createdAt))} ago
                  </span>
                </div>
              </div>

              {isOwner && (
                <div className="relative">
                  <button
                    onClick={() => setMenuVisible(!menuVisible)}
                    className="text-[#A1A1AA] hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-[#404153]"
                    title="More options"
                  >
                    <FiMoreVertical size={16} />
                  </button>
                  {menuVisible && (
                    <div
                      className="absolute right-0 mt-2 w-36 bg-gradient-to-br from-[#333447] to-[#404153] border border-[#525266] rounded-xl shadow-xl z-10 overflow-hidden"
                      role="menu"
                      aria-orientation="vertical"
                      onBlur={() =>
                        setTimeout(() => setMenuVisible(false), 150)
                      }
                    >
                      <button
                        onClick={() => {
                          onDeleteRequest(comment._id);
                          setMenuVisible(false);
                        }}
                        className="w-full text-left flex items-center px-4 py-3 text-sm text-[#FCA5A5] hover:bg-gradient-to-r hover:from-[#EF4444]/10 hover:to-[#DC2626]/10 transition-all duration-200"
                        role="menuitem"
                      >
                        <RiDeleteBin6Line className="mr-3" size={16} />
                        Delete Comment
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-4 pl-13">
              <p className="text-sm text-white leading-relaxed break-words">
                {comment.text}
              </p>
            </div>

            <div className="flex items-center justify-between pl-13">
              <div className="flex items-center space-x-4 text-xs">
                <button
                  onClick={() => onLike(comment._id, isLiked)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isLiked
                      ? "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white shadow-lg shadow-[#EF4444]/20 scale-105"
                      : "bg-gradient-to-r from-[#525266] to-[#6B7280] text-[#A1A1AA] hover:from-[#6B7280] hover:to-[#525266] hover:text-white hover:scale-105"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={!currentUserId}
                  title={
                    !currentUserId
                      ? "Login to like"
                      : isLiked
                      ? "Unlike"
                      : "Like"
                  }
                >
                  {isLiked ? (
                    <AiFillHeart size={16} />
                  ) : (
                    <AiOutlineHeart size={16} />
                  )}
                  <span className="font-semibold">{comment.likes}</span>
                </button>

                {currentUserId && (
                  <button
                    onClick={handleReplyClick}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white hover:from-[#1D4ED8] hover:to-[#3B82F6] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#3B82F6]/20"
                    title="Reply"
                  >
                    <RiReplyLine size={16} />
                    <span className="font-semibold">Reply</span>
                  </button>
                )}
              </div>
            </div>

            {showReplyForm && currentUserId && (
              <div className="mt-6 pt-6 border-t border-[#525266]">
                <form onSubmit={handleReplySubmit} className="space-y-4">
                  <div className="pl-13">
                    <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                      Replying to {comment.username}
                    </label>
                    <textarea
                      placeholder={`Write your reply...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-4 rounded-xl bg-gradient-to-br from-[#333447] to-[#404153] border border-[#525266] focus:ring-2 focus:ring-[#E27625] focus:border-[#E27625] text-white placeholder-[#6B7280] text-sm resize-none transition-all duration-300 hover:border-[#6B7280]"
                      rows={3}
                      aria-label="Reply text"
                      disabled={isSubmittingReply}
                    />
                    <div className="flex justify-end items-center mt-4 space-x-3">
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
                        {isSubmittingReply ? "Posting..." : "Post Reply"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-6 space-y-4">
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
