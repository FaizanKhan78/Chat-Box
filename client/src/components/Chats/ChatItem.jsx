import { Badge } from "@mui/material";
import { flushSync } from "react-dom"; // Needed for flushing state updates
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import React, { memo } from "react";
import { StyleLink } from "../styles/StyledComponents";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (document.startViewTransition()) {
      document.startViewTransition(() => {
        flushSync(() => {
          navigate(`/chat/${_id}`);
        });
      });
    } else {
      navigate(`/chat/${_id}`);
    }
  };

  return (
    <>
      <StyleLink
        onClick={handleNavigate}
        onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut", delay: index * 0.1 }}>
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
                {avatar ? (
                  <Avatar alt={name} src={avatar} />
                ) : (
                  <Avatar>{name?.slice(0, 2)?.toUpperCase()}</Avatar>
                )}
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
                    component="span"
                    variant="body2"
                    color="#4361ee">
                    {!username
                      ? `There are ${members.length} members`
                      : username}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </motion.div>
      </StyleLink>
    </>
  );
};

export default memo(ChatItem);
