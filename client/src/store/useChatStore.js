import toast from "react-hot-toast";
import { create } from "zustand";
import { makeAxios } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSendingMessage: false,
    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await makeAxios.get('/message/users')
            set({ users: res.data })
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            set({ isUsersLoading: false })
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await makeAxios.get(`/message/${userId}`)
            set({ messages: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    },
    sendMessages: async (messageData) => {
        set({ isSendingMessage: true })
        const { messages, selectedUser } = get()
        try {
            const res = await makeAxios.post(`/message/send/${selectedUser._id}`, messageData)
            set({
                messages: [...messages, res.data],
            })
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            set({ isSendingMessage: false })
        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get()
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket
        // todo: 
        socket.on('newMessage', (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },
    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },
    setSelectedUser: (selectedUser) => set({ selectedUser })
}))