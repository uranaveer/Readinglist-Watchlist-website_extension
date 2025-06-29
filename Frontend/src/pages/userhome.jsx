import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import authAxios from "../provider/authAxios";
import { Search, Loader } from "lucide-react";

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

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const navigate = useNavigate();
  const searchRef = useRef();

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed === "") {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      try {
        const res = await authAxios.get(`/api/search/?username=${trimmed}`);
        setResults(res.data.data || []);
      } catch (err) {
        console.error("Search error", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUser = (username) => {
    setQuery("");
    setResults([]);
    navigate(`/profile/${username}`);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-4xl mx-auto">
      <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white shadow-md focus-within:ring-2 focus-within:ring-black transition-all duration-200 w-full">
        <Search size={18} className="text-black" />
        <input
          type="text"
          placeholder="Search users..."
          className="ml-2 w-full outline-none bg-transparent text-base text-gray-700 placeholder-gray-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && <Loader size={18} className="ml-2 animate-spin text-black" />}
      </div>
      {results.length > 0 && (
        <ul className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-40 max-h-60 overflow-y-auto">
          {results.map((user) => (
            <li
              key={user.username}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectUser(user.username)}
            >
              <img
                src={`/avatars/avatar${user.avatar_id}.png`}
                alt={user.username}
                className="w-6 h-6 rounded-full border border-gray-300 object-cover"
              />
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


function Userhome() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const pageRef = useRef(1);
  const loaderRef = useRef();
  const navigate = useNavigate();
  const [username, setUsername] = useState("user");
  const [avatarId, setAvatarId] = useState(1);

  const [currentDate, setCurrentDate] = useState("Latest Posts");
  const dateRefs = useRef({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await authAxios.get("/api/user-data/");
        const { username, avatar_id } = res.data;
        setUsername(username);
        setAvatarId(avatar_id || 1);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const fetchPosts = (pageToFetch) => {
    if (loadingMore) return;
    setLoadingMore(true);
    authAxios
      .get(`/api/get-data/?page_number=${pageToFetch}`)
      .then((res) => {
        const newData = res.data.data;
        if (pageToFetch === 1) {
          setPosts(newData);
        } else {
          setPosts((prev) => [...prev, ...newData]);
        }

        if (newData.length === 0) {
          setHasMore(false);
        } else {
          const nextPage = pageToFetch + 1;
          setPage(nextPage);
          pageRef.current = nextPage;
        }
      })
      .catch((err) => console.error("Error fetching posts:", err))
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  };

  const getFaviconUrl = (link) => {
    try {
      const url = new URL(link);
      return `https://www.google.com/s2/favicons?sz=32&domain=${url.hostname}`;
    } catch {
      return "/avatars/avatar0.png";
    }
  };

  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setHasMore(true);
      setPage(1);
      pageRef.current = 1;
      fetchPosts(1);
    }, 400);
  };

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);

      // handle active date
      const dateEls = Object.values(dateRefs.current);
      let closestDate = "";
      let closestDistance = Infinity;

      dateEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top >= 80 && rect.top <= window.innerHeight) {
          if (rect.top < closestDistance) {
            closestDistance = rect.top;
            closestDate = el.innerText;
          }
        }
      });

      if (closestDate) {
        setCurrentDate(closestDate);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [posts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchPosts(pageRef.current);
        }
      },
      { threshold: 1 }
    );
    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loadingMore]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      {/* Large Title */}
      <div
        className={`transition-all duration-500 ease-out ${
          scrolled ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
        } text-center mb-10`}
      >
        <div className="flex justify-center items-center space-x-3">
          <img src="/Feedora.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-4xl font-extrabold mb-2 text-gray-900 tracking-tight">
            Feedora
          </h1>
        </div>
        <p className="text-gray-500 text-sm">Curate & share what you consume.</p>
      </div>

      {/* Mini Title */}
      <div
        className={`fixed top-4 left-5 z-30 transition-all duration-500 ease-out ${
          scrolled ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center space-x-2">
          <img src="/Feedora.png" alt="logo" className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Feedora</h1>
            <p className="text-xs text-gray-500">Curate & share what you consume</p>
          </div>
        </div>
      </div>

      {/* Sticky Search Bar + Dynamic Date */}
      <div className="sticky top-0 z-40 bg-white  py-4 mb-4">
        <div className="max-w-4xl mx-auto px-5">
          <SearchBar />
          <div className="text-lg font-semibold text-gray-700 mt-4  pb-1">
            {currentDate}
          </div>
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black border-solid"></div>
        </div>
      ) : (
        <ul className="space-y-6">
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
                  ref={(el) => (dateRefs.current[date] = el)}
                  className="text-lg font-semibold text-gray-700 mt-8 mb-2 border-b border-gray-200 pb-1"
                >
                  {date}
                </div>
              );
              groupPosts.forEach((post) => {
                const faviconUrl = getFaviconUrl(post.link);
                items.push(
                  <li
                    key={post.id}
                    className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition duration-300"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <Link to={`/profile/${post.user.username}`}>
                        <div className="flex items-center gap-2 hover:underline cursor-pointer">
                          <img
                            src={`/avatars/avatar${post.user.avatar_id}.png`}
                            alt="avatar"
                            className="w-6 h-6 rounded-full border border-gray-300"
                          />
                          <span className="text-sm text-gray-500">@{post.user.username}</span>
                        </div>
                      </Link>
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
                      {faviconUrl && (
                        <img
                          src={faviconUrl}
                          alt="favicon"
                          className="w-5 h-5 rounded"
                          onError={(e) => (e.target.src = "/avatars/avatar0.png")}
                        />
                      )}
                      <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                        <a href={post.link} target="_blank" rel="noopener noreferrer">
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

      {/* Infinite loader */}
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-black border-solid"></div>
        </div>
      )}

      {/* Back to top */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-800 text-sm z-50 active:scale-95"
        >
          ↑ Back To Top
        </button>
      )}

      {/* user menu */}
      <div className="fixed top-4 right-5 z-30 flex items-center gap-4">
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 cursor-pointer active:scale-95 p-2 rounded-xl hover:bg-gray-100 transition"
        >
          <img
            src={`/avatars/avatar${avatarId}.png`}
            alt="avatar"
            className="w-12 h-12 rounded-full border border-gray-300 object-cover"
          />
          <span className="text-base font-semibold text-gray-700">@{username}</span>
        </div>
      </div>
    </div>
  );
}


export default Userhome;

