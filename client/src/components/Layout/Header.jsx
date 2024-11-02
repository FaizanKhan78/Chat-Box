import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import {
  Avatar,
  Backdrop,
  Badge,
  Box,
  Button,
  Chip,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NOTIFICATION_COUNT,
  ONLINE_USERS,
} from "../../constants/event";
import useErrors from "../../hooks/useErrors";
import useSocketEvents from "../../hooks/useSocketEvents";
import { getOrSaveFromLocalStorage } from "../../lib/features";
import { useGetNotificationsQuery, useMyChatsQuery } from "../../redux/api/api";
import {
  setIsDeleteMenu,
  setIsMobile,
  setIsNewGroup,
  setIsParticipants,
  setIsSearch,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import ChatList from "../Chats/ChatList";
import DeleteChatMenu from "../dialog/DeleteChatMenu";
const Participants = lazy(() => import("../specific/Participants"));
const Notification = lazy(() => import("./../shared/Notification"));

const Header = () => {
  const dispatch = useDispatch();

  const socket = getSocket();

  const { isMobile } = useSelector((state) => state.misc);
  const { isSearch, isNewGroup } = useSelector((state) => state.misc);
  const friend = useSelector((state) => state.friendProfile);
  const { notificationsCount } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const { newMessagesAlert } = useSelector((state) => state.chat);

  const {
    data: notificationData,
    error: notificationError,
    isError: notificationIsError,
    refetch: notificationRefetch,
  } = useGetNotificationsQuery();

  const { isLoading, data, error, isError } = useMyChatsQuery("");

  //* UseStates
  const [chats, setChats] = useState();
  const [searchUser, setSearchUser] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // state for managing anchor element
  const [isNotification, setIsNotification] = useState(false);
  const [request, setRequest] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  //* Use Ref
  const deleteOptionAnchor = useRef();
  const participantsRef = useRef(null);
  const notificationRef = useRef(null); // ref for notification anchor element

  //* Use Locations
  const location = useLocation();

  //* Use Navigate
  const navigate = useNavigate();

  //* Use Params
  const { chatID } = useParams(); // Get the dynamic id from the URL

  //* All The Functions
  const handleMobile = () => {
    dispatch(setIsMobile(!isMobile));
  };

  const handleSearch = () => {
    setSearchUser(true);
  };

  const handleNewGroup = () => {
    dispatch(setIsNewGroup(!isNewGroup));
  };

  const handleNewFriend = () => {
    dispatch(setIsSearch(!isSearch));
  };

  const handleNavigation = (path) => {
    if (document.startViewTransition()) {
      document.startViewTransition(() => {
        flushSync(() => {
          navigate(path);
        });
      });
    } else navigate(path);
  };

  const handleNotification = () => {
    // Set anchorEl to the button element when clicked
    setAnchorEl(notificationRef.current);
    setIsNotification((prev) => !prev);
  };

  const handleParticipants = () => {
    setAnchorEl(participantsRef.current);
    dispatch(setIsParticipants(true));
  };

  const handleDeleteChat = (e, _id, groupChat) => {
    e.preventDefault();
    deleteOptionAnchor.current = e.currentTarget;
    dispatch(setIsDeleteMenu(true));
    dispatch(setSelectedDeleteChat({ chatId: _id, groupChat }));
  };

  //* All The Use Effects
  useEffect(() => {
    if (notificationData?.request) {
      setRequest(notificationData.request);
    }
  }, [notificationData, notificationData?.request]);

  useEffect(() => {
    getOrSaveFromLocalStorage({
      key: NEW_MESSAGE_ALERT,
      value: newMessagesAlert,
    });
  }, [newMessagesAlert]);

  useEffect(() => {
    setChats(data?.chat);
  }, [data?.chat]);

  useEffect(() => {
    notificationRefetch();
    getOrSaveFromLocalStorage({
      key: NOTIFICATION_COUNT,
      value: notificationsCount,
    });
  }, [notificationRefetch, notificationsCount]);

  //* Event Handler functions

  const onlineUsersListener = useCallback((data) => {
    setOnlineUsers(data);
  }, []);

  //* Event Handlers
  const eventHandlers = {
    [ONLINE_USERS]: onlineUsersListener,
  };

  useSocketEvents(socket, eventHandlers);

  useErrors([{ isError, error }]);

  useErrors([{ notificationIsError, notificationError }]);

  const isMobileDelete = useMediaQuery(
    "(min-width:320px) and (max-width:600px)"
  );

  const DrawerList = (
    <Box
      sx={{
        width: 250,
        padding: "1rem",
        bgcolor: "background.paper",
        height: "100%",
      }}
      role="presentation">
      <Grid sx={{ justifyContent: "space-around" }} container>
        <Grid item>
          {user?.avatar ? (
            <Avatar src={user?.avatar?.url} />
          ) : (
            <Avatar>{user?.name?.slice(0, 2)}</Avatar>
          )}
        </Grid>
        <Grid item sx={{ display: "flex" }}>
          <Box>
            <Tooltip title="Notification" placement="top">
              <IconButton
                onClick={handleNotification}
                ref={notificationRef} // Assign ref to IconButton
                sx={{
                  padding: "8px",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  },
                  color: "text.primary",
                }}>
                <Badge color="error" badgeContent={notificationsCount} max={10}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title="Settings">
              <IconButton
                onClick={() => handleNavigation("/setting")}
                sx={{
                  padding: "8px",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  },
                  color: "text.primary",
                }}>
                <SettingsSharpIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              onClick={handleSearch}>
              <ListItemIcon sx={{ color: "text.secondary" }}>
                <SearchIcon />
              </ListItemIcon>
              {searchUser ? (
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search..."
                  sx={{ width: "100%" }}
                />
              ) : (
                <ListItemText primary="Search" />
              )}
            </Box>
          </ListItemButton>
        </ListItem>
        <ChatList
          chats={chats}
          chatId={chatID}
          handleDeleteChat={handleDeleteChat}
          newMessagesAlert={newMessagesAlert}
          onlineUsers={onlineUsers}
        />
      </List>
    </Box>
  );

  return (
    <>
      <Grid
        container
        sx={{ padding: "1rem", alignItems: "center", flexWrap: "nowrap" }}>
        <Grid
          item
          sm={3}
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
            borderBottom: "1px solid rgba(223, 223, 223, 1)",
            paddingBottom: "1rem",
          }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginLeft: "20px",
              cursor: "pointer",
              "&:active": {
                scale: "0.9",
              },
              transition: "all .1s ease-in-out",
            }}>
            <Paper
              sx={{
                backgroundColor: "rgba(223, 223, 223, 0.2)",
                color: "text.primary",
                width: "fit-content",
                padding: ".5rem",
                letterSpacing: 1,
                placeItems: "center",
                display: "flex",
                borderRadius: "25%",
                "&:active": {
                  backgroundColor: "rgba(223, 223, 223, 0.6)", // Change background color on click
                },
              }}>
              <ArrowBackIosRoundedIcon fontSize=".3rem" />
            </Paper>
            <Typography
              sx={{
                fontSize: "1.3rem",
                letterSpacing: 1,
                color: "text.primary",
              }}>
              Chats
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6} sm={9} md={6}>
          <Box
            sx={{
              display: { xs: "block", sm: "none" },
            }}>
            <Button onClick={handleMobile}>
              <Paper
                sx={{
                  bgcolor: "rgba(223, 223, 223, 0.2)",
                  color: "text.primary",
                  padding: "0.5rem",
                  display: "flex",
                  borderRadius: "50%",
                  "&:hover": { bgcolor: "rgba(223, 223, 223, 0.4)" },
                }}>
                <MenuIcon />
              </Paper>
            </Button>
            <Drawer open={isMobile} onClose={handleMobile}>
              {DrawerList}
            </Drawer>
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Typography variant="h4" sx={{ color: "text.primary" }}>
              {location.pathname === "/setting" && "Settings"}
              {friend.groupChat && ` ${friend?.name} Group Chat`}
              {chatID && !friend.groupChat && `${friend?.name} Chat`}
            </Typography>
            {!(location.pathname === "/setting") && friend?.groupChat && (
              <Box ref={participantsRef} onClick={handleParticipants}>
                <Tooltip title="See All Participants">
                  <Chip
                    label="See All Participants"
                    variant="outlined"
                    sx={{ cursor: "pointer", borderColor: "text.primary" }}
                  />
                </Tooltip>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid
          item
          sx={{
            display: {
              xs: "none",
              md: !(location.pathname === "/setting") && "block",
            },
            borderBottom: "1px solid rgba(223, 223, 223, 1)",
            paddingBottom: "1rem",
            flexGrow: 1,
          }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginLeft: "20px",
              cursor: "pointer",
              "&:active": {
                scale: "0.9",
              },
              transition: "all .1s ease-in-out",
            }}>
            <Paper
              sx={{
                backgroundColor: "rgba(223, 223, 223, 0.2)",
                color: "text.primary",
                width: "fit-content",
                padding: ".5rem",
                letterSpacing: 1,
                placeItems: "center",
                display: "flex",
                borderRadius: "25%",
                "&:active": {
                  backgroundColor: "rgba(223, 223, 223, 0.6)", // Change background color on click
                },
              }}>
              <ArrowForwardIosRoundedIcon fontSize=".3rem" />
            </Paper>
            <Typography
              sx={{
                fontSize: "1.3rem",
                letterSpacing: 1,
                color: "text.primary",
              }}>
              Shared File
            </Typography>
          </Box>
        </Grid>
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            gap: "20px",
            alignItems: "center",
            marxginLeft: "70px",
            flexWrap: "nowrap",
          }}>
          <Grid item md={2} sm={2} onClick={handleNewFriend}>
            <Tooltip title="Add New Friend">
              <Paper
                sx={{
                  width: "fit-content",
                  borderRadius: "50%",
                  backgroundColor: "text.bgColor",
                }}
                elevation={4}>
                <IconButton
                  sx={{
                    color: "text.primary",
                  }}>
                  <GroupAddIcon />
                </IconButton>
              </Paper>
            </Tooltip>
          </Grid>

          <Grid item md={2} sm={0} onClick={handleNewGroup}>
            <Tooltip title="New Group">
              <IconButton
                sx={{
                  color: "text.primary",
                }}>
                <GroupsIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid
            onClick={() => handleNavigation("/")}
            item
            xs={6}
            sx={{
              justifyContent: "end",
              alignItems: "center",
            }}>
            <Box
              component="img"
              src="/Chat_box.png"
              alt="Logo"
              sx={{
                objectFit: "cover",
                width: { xs: "60px", md: "60px" },
                height: { xs: "50px", md: "50px" },
              }}
            />
          </Grid>
        </Box>
      </Grid>
      <Suspense fallback={<Backdrop open />}>
        <Participants anchorEl={anchorEl} />
      </Suspense>
      <Suspense fallback={<Backdrop open />}>
        <Notification
          data={request}
          setRequest={setRequest}
          anchorEl={anchorEl} // Pass anchorEl to the Notification component
          handleNotification={handleNotification}
          isNotification={isNotification}
        />
      </Suspense>
      {isMobileDelete && (
        <DeleteChatMenu deleteOptionAnchor={deleteOptionAnchor} />
      )}
    </>
  );
};

export default Header;
