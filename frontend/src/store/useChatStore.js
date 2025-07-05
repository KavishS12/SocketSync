import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/message/send-message/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
      
      // Update the last message time for the selected user
      get().updateUserLastMessageTime(selectedUser._id, res.data.createdAt);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
      
      // Update the last message time for the sender
      get().updateUserLastMessageTime(newMessage.senderId, newMessage.createdAt);
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  updateMessage: (messageId, updatedMessage) => {
    const { messages } = get();
    const updatedMessages = messages.map(msg => 
      msg._id === messageId ? updatedMessage : msg
    );
    set({ messages: updatedMessages });
  },

  deleteMessage: (messageId) => {
    const { messages } = get();
    const updatedMessages = messages.map(msg => 
      msg._id === messageId ? { ...msg, isDeleted: true, text: "This message was deleted" } : msg
    );
    set({ messages: updatedMessages });
  },

  updateUserLastMessageTime: (userId, lastMessageTime) => {
    const { users } = get();
    const updatedUsers = users.map(user => 
      user._id === userId 
        ? { ...user, lastMessageTime: lastMessageTime }
        : user
    );
    
    // Re-sort users by last message time
    const sortedUsers = updatedUsers.sort((a, b) => {
      if (!a.lastMessageTime && !b.lastMessageTime) {
        return a.name.localeCompare(b.name);
      }
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });
    
    set({ users: sortedUsers });
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
