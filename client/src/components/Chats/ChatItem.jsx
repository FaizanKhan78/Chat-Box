import { Badge } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import React, { memo } from "react";
import { StyleLink } from "../styles/StyledComponents";
const ChatItem = ({
  avatar,
  name,
  _id,
  isOnline,
  username,
  lastMessage,
  lastOnline,
  groupChat = false,
  sameSender,
  newMessages,
  index = 0,
  handleDeleteChat,
  members,
}) => {
  return (
    <>
      <StyleLink
        to={`/chat/${_id}`}
        onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}>
        <ListItem
          alignItems="flex-start"
          sx={{
            backgroundColor: sameSender ? "text.bgColor" : "unset",
            borderRadius: "15px",
            "&:hover": {
              backgroundColor: "text.bgColor",
            },
          }}>
          <ListItemAvatar>
            <Badge
              color={isOnline ? "success" : "none"}
              overlap="circular"
              badgeContent=" "
              variant="dot">
              <Avatar
                alt={name}
                src={
                  !avatar
                    ? "https://i.pinimg.com/564x/23/85/0c/23850cbe2a878e76896ec12a822239eb.jpg"
                    : avatar
                }
              />
            </Badge>
          </ListItemAvatar>
          <ListItemText
            sx={{
              color: "text.primary",
            }}
            primary={
              <>
                {name}
                {newMessages && (
                  <Typography component="span" sx={{ color: "green" }}>
                    {" "}
                    {/* Changed to "span" */}
                    {newMessages.count}{" "}
                    {newMessages.count === 1 ? "New Message" : "New Messages"}
                  </Typography>
                )}
              </>
            }
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: { md: "inline", sm: "none" } }}
                  component="span" // Changed to "span" to avoid nested <p> tags
                  variant="body2"
                  color="#4361ee">
                  {!username ? `There are ${members.length} members` : username}
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </StyleLink>
    </>
  );
};

export default memo(ChatItem);
