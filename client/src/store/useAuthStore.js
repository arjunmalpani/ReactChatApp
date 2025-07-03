import { create } from 'zustand';
import { makeAxios } from '../lib/axios';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
const BASE_URL = import.meta.env.MODE === 'development' ? `http://localhost:5001/` : '/'
export const useAuthStore = create((set, get) => ({
    authUser: null,
    onlineUsers: [],
    socket: null,

    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await makeAxios.get('/auth/check');
            set({ authUser: response.data });

            get().connectSocket()
        } catch (error) {
            set({ authUser: null, isCheckingAuth: false });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (formData) => {
        set({ isSigningUp: true });
        try {
            const response = await makeAxios.post('/auth/signup', formData);
            set({ authUser: response.data });
            toast.success('Signup successful!');

            get().connectSocket()
        } catch (error) {
            console.error('Error signing up:', error);
            toast.error(
                error.response?.data?.message || 'Signup failed. Please try again.'
            );
        } finally {
            set({ isSigningUp: false });
        }
    },
    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const response = await makeAxios.post('/auth/login', formData);
            set({ authUser: response.data });
            toast.success('Logged in successfully!');

            get().connectSocket()
        } catch (error) {
            console.error('Error logging in:', error);
            toast.error(
                error.response?.data?.message || 'Login failed. Please try again.'
            );
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: async () => {
        try {
            await makeAxios.post('/auth/logout');
            set({ authUser: null });
            toast.success('Logged out successfully.');

            get().disconnectSocket()
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error(
                error.response?.data?.message || 'Logout failed. Please try again.'
            );
        }
    },
    updateProfile: async (formData) => {
        set({ isUpdatingProfile: true });
        try {
            const response = await makeAxios.put('/auth/update-profile', formData);
            set({ authUser: response.data });
            toast.success('Profile updated successfully!');
            return { success: true };
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(
                error.response?.data?.message || 'Profile update failed. Please try again.'
            );
            return { success: false }
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser) {
            console.error('No user authenticated, cannot connect socket');
            return;
        }
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect()
        set({ socket });

        socket.on('getOnlineUsers', (userIds) => {
            set({ onlineUsers: userIds });
        })
    },
    disconnectSocket: () => {
        if (get().socket.connected) get().socket.disconnect();
        set({ socket: null });
    }
}));