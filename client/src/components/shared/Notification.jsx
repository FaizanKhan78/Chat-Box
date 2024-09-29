import { useTheme } from "@emotion/react";
import {
  faCheckCircle,
  faFileAlt,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import moment from "moment";
import toast from "react-hot-toast";
import { getToastConfig } from "../../lib/features";
import { useAcceptFriendRequestMutation } from "../../redux/api/api";

const Notification = ({
  data,
  anchorEl,
  handleNotification,
  isNotification,
}) => {
  const theme = useTheme();
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();

  const friendRequestHandler = async (_id, accept) => {
    try {
      const res = await acceptFriendRequest({ requestId: _id, accept });

      if (res.data?.success) {
        toast.success(res.data.message, getToastConfig(theme));
      } else {
        toast.error(
          res.data.message || "Something went wrong",
          getToastConfig(theme)
        );
      }
    } catch (error) {
      toast.error("Something went wrong", getToastConfig(theme));
    }
  };

  const handleDownloadFile = (_id, file, accept) => {};

  return (
    <Menu
      onClose={handleNotification}
      open={isNotification}
      anchorEl={anchorEl}
      PaperProps={{
        sx: {
          width: "320px", // Increase the width
          maxHeight: "400px", // Limit height with a scrollbar if needed
        },
      }}>
      <MenuList>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
          Notifications
        </Typography>

        {data?.request.length === 0 ? (
          <Typography sx={{ textAlign: "center", py: 2 }}>
            No Notifications
          </Typography>
        ) : (
          data?.request?.map((notif) => (
            <MenuItem
              key={notif._id}
              sx={{ py: 1.5, display: "flex", flexDirection: "column" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <Avatar
                  alt={notif.sender.name}
                  src={notif.sender.avatar}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {notif.sender.name}{" "}
                    <span style={{ fontWeight: "normal" }}>{notif.action}</span>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {moment(notif.createdAt).fromNow()} •{" "}
                    {notif.group && <span>{notif.group} </span>}
                    {!notif.isFriend && (
                      <Typography sx={{ color: "#00712D" }}>
                        New Friend Request
                      </Typography>
                    )}
                  </Typography>
                </Box>
                <FontAwesomeIcon
                  onClick={() => friendRequestHandler(notif._id, false)}
                  icon={
                    notif.status === "unread" ? faCheckCircle : faTimesCircle
                  }
                  style={{
                    color: notif.status === "unread" ? "purple" : "#ccc",
                    fontSize: "0.8rem",
                  }}
                />
              </Box>
              {!notif.isFriend && (
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    // flexDirection: "column",
                    width: "100%",
                    gap: 1,
                  }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => friendRequestHandler(notif._id, false)}>
                    Decline
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => friendRequestHandler(notif._id, true)}>
                    Accept
                  </Button>
                </Box>
              )}
              {notif.buttons && (
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                  }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      handleDownloadFile(notif._id, notif.file, false)
                    }>
                    Decline
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() =>
                      handleDownloadFile(notif._id, notif.file, true)
                    }>
                    Download
                  </Button>
                </Box>
              )}
              {notif.file && (
                <Typography
                  variant="body2"
                  sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    style={{ marginRight: 4 }}
                  />
                  {notif.file}
                </Typography>
              )}
              <Divider sx={{ mt: 2 }} />
            </MenuItem>
          ))
        )}

        {data?.request?.length > 0 && (
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              mt: 2,
              cursor: "pointer",
              color: "primary.main",
            }}>
            Mark all as read
          </Typography>
        )}
      </MenuList>
    </Menu>
  );
};

export default Notification;
