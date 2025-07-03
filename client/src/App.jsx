import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { GridLoader } from "react-spinners";
import { Toaster } from "react-hot-toast";
import ChatPage from "./pages/ChatPage";
function App() {
  const { authUser, isCheckingAuth, checkAuth, onlineUsers } = useAuthStore();
    
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <GridLoader color="#ffffff" />
      </div>
    );

  return (
    <div >
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={authUser ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
export default App;
