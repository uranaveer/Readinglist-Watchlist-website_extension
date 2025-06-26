import { useState, useEffect } from "react";
import authAxios from "../provider/authAxios";
import { PlusCircle, X, CheckCircle, RefreshCcw } from "lucide-react";

const avatarPaths = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png"
];

function Post({ username }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(`/api/profile/${username}/`);
      const data = res.data.data;
      const processedPosts = data.map((post) => ({
        ...post,
        avatarPath: avatarPaths[post.user.avatar_id - 1 % avatarPaths.length],
      }));
      setPosts(processedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [username]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-5 relative">
      {/* Sticky AddPosts */}
      <div className="sticky top-4 z-10 bg-white shadow">
        <AddPosts onPostAdded={fetchPosts} />
      </div>

      {/* Posts */}
      <ul className="space-y-6 mt-6 pb-20">
        {posts.map((post) => {
          const domain = new URL(post.link).hostname;
          const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
          return (
            <li
              key={post.id}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={post.avatarPath}
                    alt="avatar"
                    className="w-6 h-6 rounded-full border border-gray-300"
                  />
                  <span className="text-sm text-gray-500">@{post.user.username}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{new Date(post.created_at).toLocaleString()}</span>
                  <img
                    src={favicon}
                    alt="site icon"
                    className="w-5 h-5"
                    title={domain}
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  {post.title}
                </a>
              </h3>
              <p className="text-gray-600 mt-2">{post.description}</p>
            </li>
          );
        })}
      </ul>

      {loading && (
        <div className="flex justify-center mt-6">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Floating Refresh Button */}
      <button
        onClick={fetchPosts}
        className="fixed bottom-6 left-6 bg-white text-black py-2 px-4 rounded font-medium border border-black hover:bg-black hover:text-white transition shadow-md z-20"
      >
        Refresh Posts
      </button>
    </div>
  );
}

// -----------------------------
// AddPosts Component
// -----------------------------

function AddPosts({ onPostAdded }) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setLink("");
    setDescription("");
    setExpanded(false);
  };

  const handleSubmit = async () => {
    if (!title || !link || !description) return;
    setLoading(true);
    try {
      const res = await authAxios.post("/api/add_post/", {
        title,
        link,
        description
      });
      if (res.data?.message === "Post Created") {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          resetForm();
        }, 1000);
        onPostAdded(); // refresh posts after post
      }
    } catch (error) {
      console.error("Failed to add post", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md mb-4 max-w-md mx-auto">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center space-x-2 text-gray-700 hover:text-black transition text-sm font-medium border border-gray-300 rounded px-3 py-1.5 bg-white w-full"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Share something</span>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-gray-800">New Post</h3>
            <button
              onClick={() => setExpanded(false)}
              className="text-gray-500 hover:text-red-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="text"
            placeholder="Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
            rows={3}
          />

          <div className="flex items-center justify-between">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
            >
              {loading ? "Posting..." : "Add Post"}
            </button>
            {success && <CheckCircle className="text-green-600 w-6 h-6 animate-ping" />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
