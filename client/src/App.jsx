import { lazy, Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import AdminSkeleton from "./components/Layout/Loaders/AdminSkeleton";
import Skeleton from "./components/Layout/Loaders/Skeleton";
import withAppLayout from "./components/Layout/withAppLayout";
import NetflixIntro from "./components/NetflixIntro.jsx"; // Import the intro component
import Chat from "./pages/Chat";
import { SocketProvider } from "./socket.jsx";
import useProfile from "./hooks/useProfile.jsx";

const GroupManage = lazy(() => import("./pages/admin/GroupManage"));
const UserManage = lazy(() => import("./pages/admin/UserManage"));
const MessageManage = lazy(() => import("./pages/admin/MessageManage"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Group = lazy(() => import("./pages/Groups/Group.jsx"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Admin = lazy(() => import("./pages/admin/Admin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const Setting = lazy(() => import("./pages/setting/Setting"));

const EnhancedHome = withAppLayout(Home);
const EnhancedChat = withAppLayout(Chat);
const EnhancedSetting = withAppLayout(Setting);

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const { user, isAdmin } = useSelector((state) => state.auth);

  useProfile();
  // Netflix intro timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500); // Display intro for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Fetch user profile on mount

  if (showIntro) {
    return <NetflixIntro />;
  }

  return (
    <Router>
      <Routes>
        <Route
          element={
            <Suspense fallback={<Skeleton />}>
              <SocketProvider>
                <ProtectRoute user={user} />
              </SocketProvider>
            </Suspense>
          }>
          <Route path="/" element={<EnhancedHome />} />
          <Route path="/chat/:chatID" element={<EnhancedChat />} />
          <Route path="/group" element={<Group />} />
          <Route path="/setting" element={<EnhancedSetting />} />

          {isAdmin && (
            <Route
              path="/admin"
              element={
                <Suspense fallback={<AdminSkeleton />}>
                  <Admin />
                </Suspense>
              }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="groups" element={<GroupManage />} />
              <Route path="messages" element={<MessageManage />} />
              <Route path="user" element={<UserManage />} />
            </Route>
          )}
        </Route>

        <Route
          path="/login"
          element={
            <Suspense fallback={<Skeleton />}>
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
