import { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Group = lazy(() => import("../pages/Groups/Group.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));
const Admin = lazy(() => import("../pages/admin/Admin.jsx"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard.jsx"));
const GroupManage = lazy(() => import("../pages/admin/GroupManage.jsx"));
const UserManage = lazy(() => import("../pages/admin/UserManage.jsx"));
const MessageManage = lazy(() => import("../pages/admin/MessageManage.jsx"));
const Setting = lazy(() => import("../pages/setting/Setting.jsx"));
const Chat = lazy(() => import("../pages/Chat"));

export {
  Home,
  Login,
  Group,
  NotFound,
  Admin,
  AdminDashboard,
  GroupManage,
  UserManage,
  MessageManage,
  Setting,
  Chat,
};
