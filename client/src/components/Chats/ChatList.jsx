import List from "@mui/material/List";
import ChatItem from "./ChatItem";
import { Typography } from "@mui/material";

export default function ChatList({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) {
  // console.log(chats);
  return (
    <List
      sx={{
        width: w,
        marginTop: "10px",
        height: {
          lg: "100%", // 80% of viewport height on extra-large screens
        },
        overflowY: "auto", // Change 'scroll' to 'auto' for better UX
      }}>
      {chats?.length === 0 && <Typography>No Chats</Typography>}
      {chats?.length > 0 &&
        chats?.map((data, index) => {
          const { avatar, _id, name, groupChat, members, username } = data;
          const newMessages = newMessagesAlert.find(
            ({ chatId }) => chatId === _id
          );

          const isOnline = members?.some((member) => onlineUsers.includes(_id));

          return (
            <ChatItem
              username={username}
              key={index}
              index={index}
              newMessages={newMessages}
              isOnline={isOnline}
              name={name}
              _id={_id}
              groupChat={groupChat}
              avatar={avatar}
              sameSender={chatId === _id}
              handleDeleteChat={handleDeleteChat}
              members={members}
            />
          );
        })}
    </List>
  );
}
