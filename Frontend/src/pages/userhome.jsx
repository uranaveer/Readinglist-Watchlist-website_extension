import authAxios from "../provider/authAxios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const avatarPaths = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png"
];


function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("user");
  const [avatarId, setAvatarId] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await authAxios.get("/api/user-data/");
        const { username, avatar_id } = res.data;
        setUsername(username);
        setAvatarId(avatar_id || 0);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const goToProfile = () => {
    navigate("/profile");
  };

  const avatarUrl = avatarPaths[avatarId - 1] || avatarPaths[0];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">MindTrace</div>
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={goToProfile}
      >
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full border border-gray-300"
        />
        <span className="text-sm font-medium">@{username}</span>
      </div>
    </header>
  );
}


function Post() {
  const [posts, setPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);
  const postsPerPage = 10;

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(`/api/get_data/?page_number=${pageNumber}`);
      const data = res.data.data;
      setTotalPosts(res.data.total_posts);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageNumber]);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div id="user_posts" className="max-w-4xl mx-auto py-10 px-5">
      <ul className="space-y-6">
        {posts.map((post) => {
          const domain = new URL(post.link).hostname;
          const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

          return (
            <li
              key={post.id}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <Link to={`/accountprofile/${post.user.username}`}>
                  <div className="flex items-center gap-2 hover:underline cursor-pointer">
                    <img
                      src={post.avatarPath}
                      alt="avatar"
                      className="w-6 h-6 rounded-full border border-gray-300"
                    />
                    <span className="text-sm text-gray-500">@{post.user.username}</span>
                  </div>
                </Link>
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber === 1}
          className="py-2 px-3 rounded border bg-white hover:bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {pageNumber} of {totalPages}
        </span>

        <button
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
          disabled={pageNumber === totalPages}
          className="py-2 px-3 rounded border bg-white hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Floating Refresh Button (bottom-left corner) */}
      <button
        onClick={fetchPosts}
        className="fixed bottom-6 left-6 bg-white text-black py-2 px-4 rounded font-medium border border-black hover:bg-black hover:text-white transition shadow-md"
      >
        Refresh Posts
      </button>
    </div>
  );
}



function UserHome() {
    return (
        <div className="bg-white min-h-screen text-black font-sans">
        <Header />
        <div className="pt-6"> {/* Padding so content isn’t hidden under sticky header */}
            <Post />
        </div>
        </div>
    );
}

export default UserHome;