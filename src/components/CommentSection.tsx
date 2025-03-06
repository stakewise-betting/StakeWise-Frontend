// frontend >>
import { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiMoreVertical } from "react-icons/fi";

type Comment = {
  _id: string;
  username: string;
  text: string;
  createdAt: string;
  likes: number;
  likedByUser?: boolean;
  userId: string; // Add userId to the Comment type
};

const CommentSection = ({
  betId,
  currentUserId,
}: {
  betId: string;
  currentUserId?: string;
}) => {
  // Add currentUserId prop
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  // Removed username state
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [menuVisibleCommentId, setMenuVisibleCommentId] = useState<
    string | null
  >(null);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  useEffect(() => {
    if (!betId) return;

    axios
      .get(`http://localhost:5000/api/comments/${betId}`)
      .then((res) => {
        const initialComments = res.data.map((comment: Comment) => ({
          ...comment,
          likedByUser: likedComments.has(comment._id),
        }));
        setComments(initialComments);
        console.log("Initial comments fetched:", initialComments);
      })
      .catch((error) => console.error("Error fetching comments:", error));
  }, [betId]);

  const handleAddComment = async () => {
    console.log("handleAddComment function called"); // ADD THIS LINE
    console.log("newComment value:", newComment); // ADD THIS LINE
    console.log("currentUserId value:", currentUserId); // ADD THIS LINE

    if (!newComment.trim() || !currentUserId) {
      console.log("Validation failed - comment or userId missing"); // ADD THIS LINE
      return;
    }

    console.log("Validation passed - making API call"); // ADD THIS LINE

    try {
      const res = await axios.post("http://localhost:5000/api/comments", {
        betId,
        userId: currentUserId,
        text: newComment,
      });

      console.log("API Response received:", res.data); // ADD THIS LINE
      setComments([...comments, { ...res.data, likedByUser: false }]);
      setNewComment("");
    } catch (error) {
      console.error("Error in handleAddComment:", error); // Keep this error log
    }
  };

  const handleLike = async (commentId: string) => {
    console.log("handleLike called for commentId:", commentId);
    console.log("likedComments before click:", likedComments);

    if (likedComments.has(commentId)) {
      // Unlike action
      setLikedComments((prevLikedComments) => {
        const newLikedComments = new Set(prevLikedComments);
        newLikedComments.delete(commentId);
        return newLikedComments;
      });

      try {
        const unlikeRes = await axios.post(
          `http://localhost:5000/api/comments/unlike/${commentId}`
        );
        console.log("Unlike API response:", unlikeRes.data);
        setComments(
          comments.map((c) =>
            c._id === commentId
              ? { ...c, likes: unlikeRes.data.likes, likedByUser: false }
              : c
          )
        );
      } catch (error) {
        console.error("Error in unlike API:", error);
      }
    } else {
      // Like action
      setLikedComments(
        (prevLikedComments) => new Set(prevLikedComments.add(commentId))
      );

      try {
        const likeRes = await axios.post(
          `http://localhost:5000/api/comments/like/${commentId}`
        );
        console.log("Like API response:", likeRes.data);
        setComments(
          comments.map((c) =>
            c._id === commentId
              ? { ...c, likes: likeRes.data.likes, likedByUser: true }
              : c
          )
        );
      } catch (error) {
        console.error("Error in like API:", error);
      }
    }
    console.log("likedComments after click:", likedComments);
    console.log(
      "comments state after click:",
      comments.find((c) => c._id === commentId)
    );
  };

  const handleDelete = async () => {
    if (commentToDelete) {
      await axios.delete(
        `http://localhost:5000/api/comments/${commentToDelete}`,
        { data: { userId: currentUserId } } // Send userId for deletion authorization
      );
      setComments(comments.filter((c) => c._id !== commentToDelete));
      setCommentToDelete(null);
      setShowConfirmation(false);
    }
  };

  const handleDotsClick = (commentId: string) => {
    setMenuVisibleCommentId(
      menuVisibleCommentId === commentId ? null : commentId
    );
  };

  const confirmDelete = (commentId: string) => {
    setCommentToDelete(commentId);
    setShowConfirmation(true);
    setMenuVisibleCommentId(null);
  };

  const cancelDeleteConfirmation = () => {
    setShowConfirmation(false);
    setCommentToDelete(null);
  };

  return (
    <div className="p-4 bg-primary text-DFprimary rounded-lg">
      <h3 className="text-lg font-bold mb-2">Comments</h3>
      <div className="mb-3">
        {/* Removed username input */}
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="p-2 border rounded w-full text-black"
        />
        <button
          onClick={handleAddComment}
          className="bg-orange500 hover:bg-orange600 text-white p-2 rounded mt-2"
        >
          Add Comment
        </button>
      </div>
      <div>
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="p-2 border-b border-gray-600 relative"
          >
            <div className="flex justify-between">
              <p className="text-sm text-DFsecondary">{comment.username}</p>
              <span className="text-xs text-sub">
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </span>
            </div>
            <p className="text-DFprimary">{comment.text}</p>
            <div className="flex items-center mt-1">
              <button
                onClick={() => handleLike(comment._id)}
                className="text-red flex items-center mr-2"
              >
                {comment.likedByUser ? (
                  <AiFillHeart className="text-red-500" />
                ) : (
                  <AiOutlineHeart className="text-DFprimary" />
                )}
                <span className="ml-1">{comment.likes}</span>
              </button>
              {/* Conditionally render delete button based on ownership */}
              {currentUserId === comment.userId && (
                <>
                  <button
                    onClick={() => handleDotsClick(comment._id)}
                    className="text-DFprimary ml-auto"
                  >
                    <FiMoreVertical />
                  </button>
                  {menuVisibleCommentId === comment._id && (
                    <div
                      className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu-button"
                    >
                      <div className="py-1" role="menuitem">
                        <button
                          onClick={() => confirmDelete(comment._id)}
                          className="text-red-500 flex items-center px-4 py-2 text-sm hover:bg-gray-800 w-full text-left"
                          role="menuitem"
                        >
                          <RiDeleteBin6Line className="mr-2" /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {showConfirmation && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              ​
            </span>

            <div className="inline-block align-bottom bg-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-DFprimary"
                      id="modal-title"
                    >
                      Delete Comment
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-DFsecondary">
                        Are you sure you want to delete this comment? This
                        action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red text-base font-medium text-DFprimary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={cancelDeleteConfirmation}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
