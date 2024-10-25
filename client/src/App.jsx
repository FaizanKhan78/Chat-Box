import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import introAudio from "./audio/intro.wav";
import useProfile from "./hooks/useProfile.jsx";
import {
  AdminSkeleton,
  Intro,
  ProtectRoute,
  Skeleton,
  SocketProvider,
} from "./imports/components";
import { EnhancedChat, EnhancedHome, EnhancedSetting } from "./imports/layout";
import {
  Admin,
  AdminDashboard,
  Group,
  GroupManage,
  Login,
  MessageManage,
  NotFound,
  UserManage,
} from "./imports/pages";

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const { user, isAdmin } = useSelector((state) => state.auth);

  useProfile();

  // Netflix intro timeout
  const playAudio = () => {
    const audio = new Audio(introAudio);
    audio.play().catch((error) => {
      // console.log(error);
    });
  };

  useEffect(() => {
    playAudio();
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500); // Display intro for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (showIntro) {
    return <Intro />;
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
