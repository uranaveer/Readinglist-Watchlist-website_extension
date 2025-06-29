import { useState, useEffect } from "react";
import authAxios from "../provider/authAxios";
import { RefreshCcw } from "lucide-react";

const avatarPaths = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png"
];

const formatTime = (timestamp) => {
  const now = new Date();
  const postDate = new Date(timestamp);
  const diff = (now - postDate) / 1000;

  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 3 * 86400) return `${Math.floor(diff / 86400)}d ago`;

  if (now.getFullYear() !== postDate.getFullYear()) {
    return postDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return postDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

function Post({ username }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(`/api/profile/${username}/`);
      const data = res.data.data;
      setPosts(data);
      window.scrollTo({ top: 0, behavior: "smooth" }); // after refresh, scroll to top
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [username]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getFaviconUrl = (link) => {
    try {
      const url = new URL(link);
      return `https://www.google.com/s2/favicons?sz=32&domain=${url.hostname}`;
    } catch {
      return "/avatars/avatar0.png";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-5 relative">
      {posts.length === 0 && !loading ? (
        <div className="text-center text-2xl font-bold text-gray-400 py-20">
          No posts yet
        </div>
      ) : (
        <ul className="space-y-6 mt-6 pb-20">
          {(() => {
            const groups = {};
            posts.forEach((post) => {
              const dateStr = new Date(post.created_at).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              if (!groups[dateStr]) groups[dateStr] = [];
              groups[dateStr].push(post);
            });

            const items = [];
            Object.entries(groups).forEach(([date, groupPosts]) => {
              items.push(
                <div
                  key={date}
                  className="sticky top-4 bg-white text-lg font-semibold text-gray-700 mt-8 mb-2 border-b border-gray-200 pb-1 z-10"
                >
                  {date}
                </div>
              );
              groupPosts.forEach((post) => {
                const favicon = getFaviconUrl(post.link);
                return items.push(
                  <li
                    key={post.id}
                    className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition duration-300"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={`/avatars/avatar${post.user.avatar_id || 0}.png`}
                          alt="avatar"
                          className="w-6 h-6 rounded-full border border-gray-300"
                        />
                        <span className="text-sm text-gray-500">@{post.user.username}</span>
                      </div>
                      <span className="text-sm text-gray-400 group relative">
                        <span className="group-hover:hidden">
                          {formatTime(post.created_at)}
                        </span>
                        <span className="hidden group-hover:inline">
                          {new Date(post.created_at).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <img src={favicon} alt="favicon" className="w-5 h-5 rounded" />
                      <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {post.title}
                        </a>
                      </h3>
                    </div>
                    <p className="text-gray-600 mt-2">{post.description}</p>
                  </li>
                );
              });
            });
            return items;
          })()}
        </ul>
      )}

      {loading && (
        <div className="flex justify-center mt-6">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Floating Refresh Button */}
      <button
        onClick={fetchPosts}
        className="fixed bottom-6 left-6 bg-white text-black py-2 px-4 rounded font-medium border border-black hover:bg-black hover:text-white transition shadow-md z-20 active:scale-95"
      >
        Refresh Posts
      </button>

      {/* Back To Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-800 transition-all text-sm z-20 active:scale-95"
        >
          ↑ Back To Top
        </button>
      )}
    </div>
  );
}

export default Post;