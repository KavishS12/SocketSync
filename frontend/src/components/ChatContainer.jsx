import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, getDateLabel } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(() => {
          let lastDate = null;
          return messages.map((message, idx) => {
            const currentDate = getDateLabel(message.createdAt);
            const showDateSeparator = currentDate !== lastDate;
            lastDate = currentDate;
            return (
              <>
                {showDateSeparator && (
                  <div className="flex items-center my-6" key={`date-separator-${currentDate}-${idx}`}> 
                    <div className="flex-grow border-t border-base-300"></div>
                    <span className="mx-4 px-3 py-1 rounded-full bg-base-200 text-base-content text-xs font-semibold shadow-sm">
                      {currentDate}
                    </span>
                    <div className="flex-grow border-t border-base-300"></div>
                  </div>
                )}
                <div
                  key={message._id}
                  className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                  ref={messageEndRef}
                >
                  <div className=" chat-image avatar">
                    <div className="size-10 rounded-full border">
                      <img
                        src={
                          message.senderId === authUser._id
                            ? authUser.profilePic || "/avatar.png"
                            : selectedUser.profilePic || "/avatar.png"
                        }
                        alt="profile pic"
                      />
                    </div>
                  </div>
                  <div
                    className={`chat-bubble flex flex-col ${
                      message.senderId === authUser._id
                        ? "bg-primary text-primary-content"
                        : "bg-base-200 text-base-content"
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-[200px] rounded-md mb-2"
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                    <span className="text-[10px] mt-1.5 opacity-60 self-end">
                      {formatMessageTime(message.createdAt).split(' ')[1]}
                    </span>
                  </div>
                </div>
              </>
            );
          });
        })()}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
