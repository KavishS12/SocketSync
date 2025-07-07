import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Calendar, XCircle } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleRemoveProfilePic = async () => {
    setSelectedImg(null);
    await updateProfile({ profilePic: "" });
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-base-content/60">Manage your account information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-base-200 rounded-2xl p-6 space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
                
                <div className="relative inline-block">
                  <img
                    src={selectedImg || authUser.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="size-40 rounded-full object-cover border-4 border-base-300 shadow-lg"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`
                      absolute bottom-2 right-2 
                      bg-primary hover:bg-primary/80
                      p-3 rounded-full cursor-pointer 
                      transition-all duration-200 shadow-lg
                      ${isUpdatingProfile ? "animate-pulse pointer-events-none" : "hover:scale-110"}
                    `}
                  >
                    <Camera className="w-5 h-5 text-primary-content" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                  {/* X icon for removing profile picture */}
                  {(authUser.profilePic || selectedImg) && (
                    <button
                      className="absolute top-2 right-2 bg-primary hover:bg-primary/80 text-primary-content rounded-full p-1.5 shadow disabled:opacity-50 z-10"
                      onClick={handleRemoveProfilePic}
                      disabled={isUpdatingProfile}
                      title="Remove profile picture"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  )}
                </div>
                
                <p className="text-sm text-base-content/60 mt-4">
                  {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="lg:col-span-2">
            <div className="bg-base-200 rounded-2xl p-6 space-y-6">
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
              
              <div className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <div className="text-sm text-base-content/60 flex items-center gap-2 font-medium">
                    <User className="w-4 h-4" />
                    Full Name
                  </div>
                  <div className="px-4 py-3 bg-base-100 rounded-xl border border-base-300">
                    <p className="font-medium">{authUser?.name}</p>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <div className="text-sm text-base-content/60 flex items-center gap-2 font-medium">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                  <div className="px-4 py-3 bg-base-100 rounded-xl border border-base-300">
                    <p className="font-medium">{authUser?.email}</p>
                  </div>
                </div>

                {/* Member Since Field */}
                <div className="space-y-2">
                  <div className="text-sm text-base-content/60 flex items-center gap-2 font-medium">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </div>
                  <div className="px-4 py-3 bg-base-100 rounded-xl border border-base-300">
                    <p className="font-medium">
                      {authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
