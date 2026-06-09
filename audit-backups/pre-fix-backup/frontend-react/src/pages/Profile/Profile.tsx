import React, { useRef, useState, useEffect } from "react";
import { User, ImageUp, Save, Mail, PencilLine, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { silentRefresh } from "@/store/auth/authSlice"; 
import { useNavigate } from "react-router-dom";
import axios from "@/config/axiosInstance";
import NotificationService from "@/components/NotificationService";

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

  // Hydrate the form data when the user object is available from the store
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.username || user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
      if (user.image) {
        setAvatarPreview(user.image);
      }
    }
  }, [user]);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to ~2MB to prevent large DB payloads)
      if (file.size > 2 * 1024 * 1024) {
        NotificationService.error("Image must be smaller than 2MB");
        return;
      }
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        name: formData.name,
        bio: formData.bio,
        image: avatarPreview && avatarPreview.startsWith('data:image') ? avatarPreview : undefined
      };
      
      const response = await axios.put('/auth/profile', payload);
      
      if (response.data.success) {
        NotificationService.success('Profile updated successfully');
        dispatch(silentRefresh());
        setTimeout(() => {
          navigate(-1);
        }, 800);
      }
    } catch (error: any) {
      NotificationService.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" flex justify-center items-center bg-gray-50 dark:bg-[#121212] p-6">
      <div className="max-w-4xl w-full bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-10">
        <h2 className="text-4xl font-mdeium text-center mb-12 text-gray-900 dark:text-white">
          Your Profile
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start"
        >
          {/* Avatar Section */}
          <div className="relative flex flex-col items-center">
            <div className="w-36 h-36 rounded-full ring-2 ring-black shadow-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <User className="w-20 h-20 text-gray-400 dark:text-gray-400" />
              )}

              {/* Edit button */}
              <button
                type="button"
                onClick={handleEditClick}
                className="absolute z-10 bottom-1 right-4 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md hover:bg-black hover:text-white transition-colors cursor-pointer"
                aria-label="Upload Avatar"
                title="Change Avatar"
              >
                <ImageUp className="w-6 h-6" />
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Form fields */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="flex items-center bg-white dark:bg-[#2c2c2c] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-gray-600 transition">
            <User className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
            <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-transparent outline-none text-black dark:text-white placeholder-gray-400"
                required
            />
            </div>

            <div className="flex items-center bg-white dark:bg-[#2c2c2c] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-gray-600 transition">
            <Mail className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
            <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                required
            />
            </div>

            <div className="flex bg-white dark:bg-[#2c2c2c] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-gray-600 transition">
            <PencilLine className="w-5 h-5 text-gray-400 dark:text-gray-300 mt-1 mr-3" />
            <textarea
                name="bio"
                placeholder="Add bio ...."
                value={formData.bio}
                onChange={handleInputChange}
                rows={5}
                className="w-full bg-transparent outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400"
            />
            </div>


            {/* Action Buttons */}
            <div className="flex justify-end mt-4 gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-semibold shadow-sm focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-3 bg-blue-600 cursor-pointer hover:bg-blue-700 transition-colors text-white px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
