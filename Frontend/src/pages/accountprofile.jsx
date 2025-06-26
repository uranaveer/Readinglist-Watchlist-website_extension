import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authAxios from "../provider/authAxios";
import { ArrowLeft } from "lucide-react"; // optional back icon

function AccountProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authAxios.get(`/api/profile/${username}/`);
        setProfile(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center mt-6">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-5 flex gap-6">
      {/* Profile Sidebar */}
      <aside className="w-64 p-4 bg-white shadow rounded-xl sticky top-4 h-fit">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4"
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
                      src={`/avatars/avatar${profile.avatar_id}.png`}
                      alt="avatar"
                      className="w-6 h-6 rounded-full border border-gray-300"
                    />
                    <span className="text-sm text-gray-500">@{profile.username}</span>
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
      </div>
    </div>
  );
}

export default AccountProfile;
