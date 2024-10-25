import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  Backdrop,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  TextField,
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
import useErrors from "../../hooks/useErrors";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  setIsDeleteMenu,
  setIsNewGroup,
  setIsSearch,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import NewFriend from "../shared/NewFriend";
import ChatList from "./ChatList";
import { getOrSaveFromLocalStorage } from "../../lib/features";
import {
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/event";
import useSocketEvents from "../../hooks/useSocketEvents";
import { getSocket } from "../../socket";
import { useNavigate, useParams } from "react-router-dom";
import DeleteChatMenu from "../dialog/DeleteChatMenu";

const NewGroup = lazy(() => import("./../shared/NewGroup"));

const Chat = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { isSearch, isNewGroup } = useSelector((state) => state.misc);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = getSocket();
  const chatID = useParams();
  const { isLoading, data, error, isError, refetch } = useMyChatsQuery("");
  const { newMessagesAlert } = useSelector((state) => state.chat);

  const handleNewGroup = () => {
    dispatch(setIsNewGroup(!isNewGroup));
  };

  const handleNewFriend = () => {
    dispatch(setIsSearch(!isSearch));
  };

  const deleteOptionAnchor = useRef();

  const handleDeleteChat = (e, _id, groupChat) => {
    e.preventDefault();
    deleteOptionAnchor.current = e.currentTarget;
    dispatch(setIsDeleteMenu(true));
    dispatch(setSelectedDeleteChat({ chatId: _id, groupChat }));
  };

  useEffect(() => {
    getOrSaveFromLocalStorage({
      key: NEW_MESSAGE_ALERT,
      value: newMessagesAlert,
    });
  }, [newMessagesAlert]);

  const [chats, setChats] = useState();
  useEffect(() => {
    setChats(data?.chat);
  }, [data?.chat]);

  const refetchListener = useCallback(() => {
    refetch();
    navigate("/");
  }, [refetch, navigate]);

  const onlineUsersListener = useCallback((data) => {
    setOnlineUsers(data);
  }, []);

  const eventHandlers = {
    [REFETCH_CHATS]: refetchListener,
    [ONLINE_USERS]: onlineUsersListener,
  };

  useSocketEvents(socket, eventHandlers);

  const [filter, setFilter] = useState("");

  useErrors([{ isError, error }]);
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    const filterChat = data?.chat.filter((chat) =>
      chat.name.includes(e.target.value)
    );
    setChats(filterChat);
  };

  return (
    <div style={{ padding: "10px 20px 0px 20px" }}>
      <TextField
        label="Search"
        id="outlined-size-small"
        size="small"
        value={filter}
        onChange={handleFilterChange}
        sx={{
          width: "100%",
          backgroundColor: "text.bgColor",
          color: "black",
          borderRadius: "15px",
        }}
        InputProps={{
          style: { borderRadius: "15px" },
        }}
      />
      <Grid
        container
        sx={{
          alignItems: "center",
          marginTop: "1rem",
        }}>
        <Grid item md={8} sm={10}>
          <Typography fontSize={"1.4rem"}>Chats</Typography>
        </Grid>

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
      </Grid>

      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroup isNewGroup={isNewGroup} handleNewGroup={handleNewGroup} />
        </Suspense>
      )}

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <NewFriend isSearch={isSearch} handleNewFriend={handleNewFriend} />
        </Suspense>
      )}

      {/* Chat List */}
      <div style={{ height: `calc(100vh - 58vh)` }}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <ChatList
            chats={chats}
            chatId={chatID}
            handleDeleteChat={handleDeleteChat}
            newMessagesAlert={newMessagesAlert}
            onlineUsers={onlineUsers}
          />
        )}
      </div>
      <DeleteChatMenu deleteOptionAnchor={deleteOptionAnchor} />
    </div>
  );
};

export default Chat;
