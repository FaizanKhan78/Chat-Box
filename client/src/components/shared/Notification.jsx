import {
  faCheckCircle,
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
import { useDispatch } from "react-redux";
import useAsyncMutation from "../../hooks/useAsyncMutation";
import { useAcceptFriendRequestMutation } from "../../redux/api/api";
import { decrementNotificationsCount } from "../../redux/reducers/chat";

const Notification = ({
  data,
  setRequest,
  anchorEl,
  handleNotification,
  isNotification,
}) => {
  const dispatch = useDispatch();
  const [acceptFriendRequest] = useAsyncMutation(
    useAcceptFriendRequestMutation
  );

  const friendRequestHandler = async (_id, accept) => {
    dispatch(decrementNotificationsCount());
    const filterData = data?.filter((req) => req._id !== _id);
    setRequest(filterData);
    await acceptFriendRequest("Friend ", "Request Accepted ", {
      requestId: _id,
      accept,
    });
  };

  // const handleDownloadFile = (_id, file, accept) => {};

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

        {data?.length === 0 ? (
          <Typography sx={{ textAlign: "center", py: 2 }}>
            No Notifications
          </Typography>
        ) : (
          data?.map((notif) => (
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
              {/* {notif.buttons && (
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
              )} */}
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
