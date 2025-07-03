import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SideBarSkeleton";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

function SideBar() {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className="h-full w-20 lg:w-77 border-base-300 flex flex-col select-none transition-all duration-200 bg-base-100 text-base-content">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* todo : online filter */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-base-content/60">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-colors ${
              selectedUser?._id === user._id &&
              "bg-base-300 hover:bg-base-300 ring-2 ring-primary"
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePicture || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full border border-base-300"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-success 
                        rounded-full ring-2 ring-base-100"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-base-content/60">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-base-content/60">
            <Users className="size-10 mb-2" />
            <span className="text-base font-medium">No users online</span>
          </div>
        )}
      </div>
    </aside>
  );
}
export default SideBar;
