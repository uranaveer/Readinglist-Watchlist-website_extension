import { useState } from "react";

const avatarOptions = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png"
];

function Profile() {
  const username = localStorage.getItem("username") || "user";
  const [selectedAvatar, setSelectedAvatar] = useState(
    localStorage.getItem("avatar") || avatarOptions[0]
  );
  const [showAvatars, setShowAvatars] = useState(false);

  const handleAvatarChange = (avatar) => {
    setSelectedAvatar(avatar);
    localStorage.setItem("avatar", avatar);
    setShowAvatars(false);
  };

  const posts = [
    {
      id: 1,
      title: "LLM: The Good, the Bad, and the Ugly",
      summary: "Reflections on a video explaining Large Language Models.",
      time: "2025-06-21T11:00:00Z",
      link: "https://example.com/llm-video"
    },
    {
      id: 2,
      title: "Atomic Habits — Notes",
      summary: "My summary of key points from the popular book.",
      time: "2025-06-20T17:30:00Z",
      link: "https://example.com/atomic-habits"
    }
  ];

  return (
    <div className="bg-white min-h-screen text-black font-sans px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={() => window.history.back()}
          className="border border-black px-4 py-2 text-sm rounded hover:bg-black hover:text-white transition"
        >
          ← Back
        </button>
      </div>

      {/* User Info */}
      <div className="space-y-3 mb-10">
        <div className="flex items-center space-x-4">
          <img
            src={selectedAvatar}
            alt="avatar"
            className="w-20 h-20 rounded-full border border-gray-300"
          />
          <div>
            <p className="text-lg"><strong>Username:</strong> @{username}</p>
          </div>
        </div>

        <button
          onClick={() => setShowAvatars(!showAvatars)}
          className="mt-4 border border-black px-4 py-2 text-sm rounded hover:bg-black hover:text-white transition"
        >
          {showAvatars ? "Cancel" : "Choose Avatar"}
        </button>

        {showAvatars && (
          <div className="flex gap-4 mt-4 flex-wrap">
            {avatarOptions.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className={`w-16 h-16 rounded-full border-2 cursor-pointer hover:scale-105 transition ${
                  selectedAvatar === avatar ? "border-black" : "border-gray-300"
                }`}
                onClick={() => handleAvatarChange(avatar)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Posts Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
        <ul className="space-y-5">
          {posts.map((post) => (
            <li key={post.id} className="border border-gray-300 p-4 rounded hover:shadow transition">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>{new Date(post.time).toLocaleString()}</span>
              </div>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 hover:underline"
              >
                {post.title}
              </a>
              <p className="text-gray-700 mt-1">{post.summary}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Profile;
