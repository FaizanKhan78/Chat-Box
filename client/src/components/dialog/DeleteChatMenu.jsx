import { DeleteForever, Logout } from "@mui/icons-material";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import { useNavigate } from "react-router-dom";
import useAsyncMutation from "./../../hooks/useAsyncMutation";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../redux/api/api";
import { useEffect } from "react";

const DeleteChatMenu = ({ deleteOptionAnchor }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );

  const isGroup = selectedDeleteChat.groupChat;
  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteOptionAnchor.current = null;
  };

  const [deleteChat, _, deleteChatData] = useAsyncMutation(
    useDeleteChatMutation
  );
  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
    useLeaveGroupMutation
  );

  // console.log(selectedDeleteChat);

  const leaveGroupHandler = () => {
    closeHandler();
    leaveGroup("Leaving Group...", "Faizan", selectedDeleteChat.chatId);
  };

  const deleteChatHandler = () => {
    closeHandler();
    deleteChat("Deleting Chat...", "Faizan", selectedDeleteChat.chatId);
  };

  useEffect(() => {
    if (deleteChatData || leaveGroupData) {
      navigate("/");
    }
  }, [deleteChatData, navigate, leaveGroupData]);

  const menuItemStyle = {
    transition: "transform 0.4s ease, opacity 0.4s ease", // smooth transitions
    transform: isDeleteMenu ? "scale(1)" : "scale(0)",
    opacity: isDeleteMenu ? 1 : 0,
  };
  return (
    <Menu
      anchorEl={deleteOptionAnchor.current}
      open={isDeleteMenu}
      onClose={closeHandler}
      // Positioning the menu relative to the anchor element
      anchorOrigin={{
        vertical: "bottom", // Adjusts the vertical position relative to the anchor
        horizontal: "right", // Adjusts the horizontal position relative to the anchor
      }}
      transformOrigin={{
        vertical: "center", // Where the menu will appear relative to its own position
        horizontal: "right", // Aligns the menu's horizontal position relative to itself
      }}>
      <MenuItem
        sx={{
          width: "10rem",
          padding: "0.5rem",
          cursor: "pointer",
          menuItemStyle,
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        onClick={isGroup ? leaveGroupHandler : deleteChatHandler}>
        {isGroup ? (
          <Box
            onClick={leaveGroupHandler}
            color="green"
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
            }}>
            <Logout />
            <Typography>Leave Group</Typography>
          </Box>
        ) : (
          <Box
            color="red"
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
            }}>
            <DeleteForever />
            <Typography>Delete</Typography>
          </Box>
        )}
      </MenuItem>
    </Menu>
  );
};

export default DeleteChatMenu;
