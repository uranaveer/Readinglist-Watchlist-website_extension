import { useState,useEffect } from "react";
import { X, Pencil, CheckCircle } from "lucide-react";
import { PlusCircle } from "lucide-react";
import authAxios from "../provider/authAxios";
import Post from "./post";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

const avatarOptions = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png"
];


function UserInfo({ avatar, username, bio, onEdit }) {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(); // clears auth context
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="sticky top-4 z-20 bg-white p-4 rounded-xl border border-gray-200 shadow-sm w-full">
      {/* Avatar & Name */}
      <div className="flex flex-col items-center text-center mb-4">
        <img
          src={avatar}
          alt="avatar"
          className="w-20 h-20 rounded-full border border-gray-300 shadow mb-3 object-cover"
        />
        <h2 className="text-xl font-semibold text-gray-900">{username}</h2>
        <p className="text-sm text-gray-600 mt-1">{bio}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onEdit}
          className="flex items-center justify-center gap-1 border border-black px-3 py-1.5 text-sm rounded hover:bg-black hover:text-white transition"
        >
          <Pencil size={16} /> Edit Profile
        </button>

        <button
          onClick={() => window.history.back()}
          className="border border-gray-400 text-gray-700 px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition"
        >
          ← Back
        </button>

        <button
          onClick={handleLogout}
          className="border border-red-500 text-red-500 px-3 py-1.5 text-sm rounded hover:bg-red-500 hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}


function EditProfile({ currentUsername, currentBio, currentAvatar, onClose, onSave }) {
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [newBio, setNewBio] = useState(currentBio);
  const [newAvatar, setNewAvatar] = useState(currentAvatar);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const extractAvatarId = (avatarPath) => {
    const match = avatarPath.match(/avatar(\d+)\.png$/);
    return match ? parseInt(match[1]) : 1; // fallback to 1 if parsing fails
  };
  const handleSave = async () => {
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const response = await authAxios.post("/api/change-user-data/", {
        username: newUsername,
        bio: newBio,
        avatar_id: extractAvatarId(newAvatar),
        old_password: oldPassword,
        password: newPassword
      });

      
      setSuccess(true);
      onSave({
        newUsername,
        newBio,
        newAvatar
      });
      
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Current password is incorrect.");
      } else {
        setError("Something went wrong.");
        console.log(err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] p-6 overflow-y-auto relative shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black transition"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Bio</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Choose Avatar</label>
            <div className="flex flex-wrap gap-4">
              {avatarOptions.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className={`w-14 h-14 rounded-full border-2 cursor-pointer hover:scale-105 transition ${
                    newAvatar === avatar ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setNewAvatar(avatar)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Old Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle size={18} /> Changes saved successfully!
            </div>
          )}

          <button
            onClick={handleSave}
            className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}


function Profile() {
  const [username, setUsername] = useState("user");
  const [bio, setBio] = useState("This is your bio.");
  const [avatarId, setAvatarId] = useState(0);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await authAxios.get("/api/user-data/");
        const { username, bio, avatar_id } = res.data;
        setUsername(username);
        setBio(bio);
        setAvatarId(avatar_id || 0);
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileSave = ({ newUsername, newBio, newAvatar }) => {
    const newAvatarId = avatarOptions.indexOf(newAvatar);
    setUsername(newUsername);
    setBio(newBio);
    setAvatarId(newAvatarId !== -1 ? newAvatarId + 1 : 1);

    // Optionally send POST request to update backend here

    setEditing(false);
  };

  const avatar = avatarOptions[avatarId - 1] || avatarOptions[0];

  return (
    <div className="flex px-6 py-6 gap-8 bg-white min-h-screen text-black font-sans relative">
      {/* Left Column: User Info */}
      <div className="w-[280px] shrink-0">
        <UserInfo
          avatar={avatar}
          username={username}
          bio={bio}
          onEdit={() => setEditing(true)}
        />
      </div>

      {/* Right Column: Posts */}
      <div className="flex-1">
        <Post username={username} />
      </div>

      {/* Modal */}
      {editing && (
        <EditProfile
          currentUsername={username}
          currentBio={bio}
          currentAvatar={avatar}
          onClose={() => setEditing(false)}
          onSave={handleProfileSave}
        />
      )}
    </div>
  );
}

export default Profile;
