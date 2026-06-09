import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const UserAvatar: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [letter, setLetter] = useState("?");

  // Process user data to extract first letter
  useEffect(() => {
    if (user) {
      let firstLetter = "?";
      
      // If user has a username or name property
      if (user.username) {
        firstLetter = user.username.charAt(0).toUpperCase();
      } else if (user.name) {
        firstLetter = user.name.charAt(0).toUpperCase();
      } else if (user.email) {
        firstLetter = user.email.charAt(0).toUpperCase();
      } else {
        let userName = "";
        if (typeof user === "string") {
          userName = user;
        }
        if (userName && userName.trim().length > 0) {
          firstLetter = userName.trim().charAt(0).toUpperCase();
        }
      }
      
      setLetter(firstLetter);
    }
  }, [user]);

  return (
    <div className="flex items-center">
      {/* Avatar with image or first letter */}
      <div className="relative">
        {user?.image ? (
          <img 
            src={user.image} 
            alt="Avatar" 
            className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-lg">
            {letter}
          </div>
        )}
        {/* Green online indicator */}
        <div className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
      </div>
    </div>
  );
};

export default UserAvatar;
