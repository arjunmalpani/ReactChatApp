import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { useRef } from "react";

const MessagesComponent = () => {
  const { messages, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return messages.length === 0 ? (
    <div className="flex-1 flex  items-center justify-center text-zinc-400">
      <p className="text-lg">No messages yet. Start chatting!</p>
    </div>
  ) : (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {messages.map((message) => {
        const isOwnMessage = message.senderId === authUser._id;
        const profileImage = isOwnMessage
          ? authUser?.profilePicture || "/avatar.png"
          : selectedUser?.profilePicture || "/avatar.png";
        const time = new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img src={profileImage} alt="" />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">{time}</time>
            </div>
            <div className="chat-bubble flex flex-col gap-2 bg-base-200 text-base-content rounded-2xl">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && (
                <p className="text-sm sm:text-base">{message.text}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

function ChatBox() {
  const {
    isMessagesLoading,
    getMessages,
    selectedUser,
    subscribeToMessages,
    unsubscribeToMessages,
  } = useChatStore();
  useEffect(() => {
    getMessages(selectedUser?._id);
    subscribeToMessages();

    return () => {
      unsubscribeToMessages();
    };
  }, [selectedUser._id]);

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />
      {isMessagesLoading ? <MessageSkeleton /> : <MessagesComponent />}
      <MessageInput />
    </div>
  );
}
export default ChatBox;
