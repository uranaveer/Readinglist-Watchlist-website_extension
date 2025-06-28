import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authAxios from "../provider/authAxios";
import { ArrowLeft } from "lucide-react";

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

function AccountProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(`/api/profile/${username}/`);
      setProfile(res.data);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" }); // after refresh, scroll to top
    } catch (error) {
       if (error.response && error.response.status === 404) {
          navigate("/not-found");
        }
        else {
          console.error("Error fetching user:", error);
        }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackHome = () => {
    navigate("/");
    scrollToTop();
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-6">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getFaviconUrl = (link) => {
    try {
      const url = new URL(link);
      return `https://www.google.com/s2/favicons?sz=32&domain=${url.hostname}`;
    } catch {
      return "avatars/avatar0.png";
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-5 flex gap-6 relative">
      {/* Profile Sidebar */}
      <aside className="w-64 p-4 bg-white shadow rounded-xl sticky top-4 h-fit">
        <button
          onClick={handleBackHome}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
        <div className="flex flex-col items-center">
          <img
            src={`/avatars/avatar${profile.avatar_id}.png`}
            alt="avatar"
            className="w-20 h-20 rounded-full border border-gray-300"
          />
          <h2 className="text-xl font-bold mt-2">@{profile.username}</h2>
          <p className="text-gray-600 mt-1 text-center">{profile.bio}</p>
        </div>
      </aside>

      {/* Posts */}
      <div className="flex-1">
        <ul className="space-y-6">
          {profile.data.map((post) => {
            const faviconUrl = getFaviconUrl(post.link);
            
            return (
              <li
                key={post.id}
                className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={`/avatars/avatar${profile.avatar_id}.png`}
                      alt="avatar"
                      className="w-6 h-6 rounded-full border border-gray-300"
                    />
                    <span className="text-sm text-gray-500">@{profile.username}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
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
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  {faviconUrl && (
                    <img
                      src={faviconUrl}
                      alt="favicon"
                      className="w-5 h-5 rounded"
                      onError={(e) => { e.target.src = "/avatars/avatar0.png"; }}
                    />
                  )}
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
          })}
        </ul>
      </div>

      {/* Floating Refresh Button */}
      <button
        onClick={fetchProfile}
        className="fixed bottom-6 left-6 bg-white text-black py-2 px-4 rounded font-medium border border-black hover:bg-black hover:text-white transition shadow-md z-20 active:scale-95"
      >
        Refresh
      </button>

      {/* Back to Top Button */}
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

export default AccountProfile;
