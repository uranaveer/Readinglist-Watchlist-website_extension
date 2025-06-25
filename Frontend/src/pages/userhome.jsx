import authAxios from "../provider/authAxios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";


function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "user";

  const goToProfile = () => {
    navigate("/profile");
  };

  const avatarUrl = localStorage.getItem("avatar") || "/avatars/avatar1.png";



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


const avatarPaths = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png"
];

function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get('/api/get_data/');
      const data = res.data.data;

      const processedPosts = data.map((post) => ({
        ...post,
        avatarPath: avatarPaths[post.user.avatar_id % avatarPaths.length],
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
  }, []);

  return (
    <div id="user_posts" className="max-w-4xl mx-auto py-10 px-5">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Recent Posts</h2>

      <div className="flex justify-end mb-6">
        <button
          onClick={fetchPosts}
          className="bg-white text-black py-2 px-4 rounded font-medium border border-black hover:bg-black hover:text-white transition"
        >
          Refresh Posts
        </button>
      </div>

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
                <div className="flex items-center gap-2">
                  <img
                    src={post.avatarPath}
                    alt="avatar"
                    className="w-6 h-6 rounded-full border border-gray-300"
                  />
                  <span className="text-sm text-gray-500">@{post.user.username}</span>
                </div>

                {/* Website favicon */}
                <img
                  src={favicon}
                  alt="site icon"
                  className="w-5 h-5"
                  title={domain}
                />
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