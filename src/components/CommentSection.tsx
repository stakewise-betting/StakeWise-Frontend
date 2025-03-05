import { useState, useEffect } from "react";
import axios from "axios";

type Comment = {
  _id: string;
  username: string;
  text: string;
  createdAt: string;
};

const CommentSection = ({ betId }: { betId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");

  // Fetch comments
  useEffect(() => {
    if (!betId) return; // Don't fetch if betId is missing

    axios
      .get(`http://localhost:5000/api/comments/${betId}`)
      .then((res) => {
        setComments(res.data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, [betId]);

  // Add a comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !username.trim()) return;

    const res = await axios.post("http://localhost:5000/api/comments", {
      betId,
      username,
      text: newComment,
    });

    setComments([...comments, res.data]);
    setNewComment(""); // Clear input after sending
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h3 className="text-lg font-bold mb-2">Comments</h3>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded w-full mb-2 text-black"
        />
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="p-2 border rounded w-full text-black"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white p-2 rounded mt-2"
        >
          Add Comment
        </button>
      </div>
      <div>
        {comments.map((comment) => (
          <div key={comment._id} className="p-2 border-b border-gray-600">
            <p className="text-sm text-gray-300">{comment.username}:</p>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
