import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageActions from "./MessageActions";
import MessageEditModal from "./MessageEditModal";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, getDateLabel } from "../lib/utils";
import { axiosInstance } from "../lib/axios";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    updateMessage,
    deleteMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Listen for message edit/delete events
  useEffect(() => {
    const socket = useAuthStore.getState().socket;
    
    socket.on("messageEdited", (updatedMessage) => {
      updateMessage(updatedMessage._id, updatedMessage);
    });

    socket.on("messageDeleted", (deletedMessage) => {
      updateMessage(deletedMessage._id, deletedMessage);
    });

    return () => {
      socket.off("messageEdited");
      socket.off("messageDeleted");
    };
  }, [updateMessage]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setSelectedMessage(null);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await axiosInstance.delete(`/message/delete/${messageId}`);
      deleteMessage(messageId);
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleSaveEdit = async (messageId, newText) => {
    try {
      const response = await axiosInstance.put(`/message/edit/${messageId}`, { text: newText });
      updateMessage(messageId, response.data);
      setEditingMessage(null);
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

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
          const elements = [];
          
          messages.forEach((message, idx) => {
            const currentDate = getDateLabel(message.createdAt);
            const showDateSeparator = currentDate !== lastDate;
            
            if (showDateSeparator) {
              elements.push(
                <div className="flex items-center my-6" key={`date-separator-${currentDate}-${idx}`}> 
                  <div className="flex-grow border-t border-base-300"></div>
                  <span className="mx-4 px-3 py-1 rounded-full bg-base-200 text-base-content text-xs font-semibold shadow-sm">
                    {currentDate}
                  </span>
                  <div className="flex-grow border-t border-base-300"></div>
                </div>
              );
            }
            
            elements.push(
              <div
                key={message._id}
                className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} relative group`}
                ref={messageEndRef}
                onMouseEnter={() => message.senderId === authUser._id && setSelectedMessage(message._id)}
                onMouseLeave={() => setSelectedMessage(null)}
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
                  className={`chat-bubble flex flex-col relative ${
                    message.senderId === authUser._id
                      ? "bg-primary text-primary-content"
                      : "bg-base-200 text-base-content"
                  } ${message.isDeleted ? "opacity-60 italic" : ""}`}
                >
                  {message.image && !message.isDeleted && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-2">
                      {message.isEdited && (
                        <span className="text-[10px] opacity-60">edited</span>
                      )}
                    </div>
                    <span className="text-[10px] opacity-60">
                      {formatMessageTime(message.createdAt).split(' ').slice(1).join(' ')}
                    </span>
                  </div>
                  
                  {/* Action buttons for sender's messages */}
                  {selectedMessage === message._id && message.senderId === authUser._id && !message.isDeleted && (
                    <MessageActions
                      message={message}
                      onEdit={handleEditMessage}
                      onDelete={handleDeleteMessage}
                      onClose={() => setSelectedMessage(null)}
                    />
                  )}
                </div>
              </div>
            );
            
            lastDate = currentDate;
          });
          
          return elements;
        })()}
      </div>

      <MessageInput />
      
      {/* Edit Message Modal */}
      {editingMessage && (
        <MessageEditModal
          message={editingMessage}
          onSave={handleSaveEdit}
          onCancel={() => setEditingMessage(null)}
        />
      )}
    </div>
  );
};
export default ChatContainer;
