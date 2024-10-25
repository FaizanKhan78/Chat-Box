import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import {
  Backdrop,
  Badge,
  Box,
  Container,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_FRIEND_REQUEST,
  NEW_MESSAGE_ALERT,
  NOTIFICATION_COUNT,
} from "../../constants/event";
import useErrors from "../../hooks/useErrors";
import useSocketEvents from "../../hooks/useSocketEvents";
import { useGetNotificationsQuery } from "../../redux/api/api";
import {
  incrementNotificationsCount,
  setNewMessageAlert,
} from "../../redux/reducers/chat";
import { setIsNotification } from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import DropDown from "./DropDown";
import { flushSync } from "react-dom";
import { getOrSaveFromLocalStorage } from "../../lib/features";
const Notification = lazy(() => import("./../shared/Notification"));

const Profile = () => {
  const { data, errors, isError, refetch } = useGetNotificationsQuery();
  const { isNotification } = useSelector((state) => state.misc);
  const { notificationsCount } = useSelector((state) => state.chat);
  const { chatID } = useParams();

  const [request, setRequest] = useState([]);
  useEffect(() => {
    if (data?.request) {
      setRequest(data.request);
    }
  }, [data, data?.request]);
  useEffect(() => {
    refetch();
    getOrSaveFromLocalStorage({
      key: NOTIFICATION_COUNT,
      value: notificationsCount,
    });
  }, [refetch, notificationsCount]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notificationRef = useRef(null); // ref for notification anchor element
  const [anchorEl, setAnchorEl] = useState(null); // state for managing anchor element

  useErrors([{ isError, errors }]);

  const { user } = useSelector((state) => state.auth);

  const handleNotification = () => {
    // Set anchorEl to the button element when clicked
    setAnchorEl(notificationRef.current);
    dispatch(setIsNotification(!isNotification));
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
  const socket = getSocket();

  const newFriendRequestListener = useCallback(() => {
    dispatch(incrementNotificationsCount());
  }, [dispatch]);

  const newMessagesAlertListener = useCallback(
    (data) => {
      if (data.chatId === chatID) return;
      dispatch(setNewMessageAlert(data));
    },
    [dispatch, chatID]
  );

  const eventHandlers = {
    [NEW_MESSAGE_ALERT]: newMessagesAlertListener,
    [NEW_FRIEND_REQUEST]: newFriendRequestListener,
  };

  useSocketEvents(socket, eventHandlers);
  return (
    <>
      <div style={{ padding: "0 10px" }}>
        <Container
          component="section"
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            marginTop: "20px",
            flexWrap: "wrap",
            gap: "20px",
          }}>
          <Paper
            sx={{
              width: { xs: "80px", sm: "100px" },
              height: { xs: "80px", sm: "100px" },
              borderRadius: "50%",
              overflow: "hidden",
              transition: "transform 0.3s ease-in-out", // Smooth transition effect
              "&:hover": {
                transform: "scale(1.1)", // Slightly scale up on hover
              },
            }}
            elevation={4}>
            <Tooltip
              title="Profile"
              onClick={() => handleNavigation("/profile-photo")}>
              <Box
                style={{
                  viewTransitionName: `profile-photo`,
                  contain: "layout",
                }}
                component="img"
                src={user?.avatar?.url || "path-to-default-avatar.jpg"} // Default image fallback
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%", // Ensure the image remains circular
                  transition: "transform 0.3s ease-in-out", // Smooth transition for the image itself
                  "&:hover": {
                    transform: "scale(1.05)", // Slightly zoom in on hover
                  },
                }}
                alt="Profile Avatar"
              />
            </Tooltip>
          </Paper>

          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
        </Container>

        <Typography
          sx={{
            fontSize: "22px",
            textAlign: "center",
            marginTop: "20px",
            fontFamily: "hack",
            letterSpacing: "-1px",
          }}>
          {user?.username}
        </Typography>

        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <DropDown userName={user?.name} />
        </Box>
      </div>

      <Suspense fallback={<Backdrop open />}>
        <Notification
          data={request}
          setRequest={setRequest}
          anchorEl={anchorEl} // Pass anchorEl to the Notification component
          handleNotification={handleNotification}
          isNotification={isNotification}
        />
      </Suspense>
    </>
  );
};

export default Profile;
