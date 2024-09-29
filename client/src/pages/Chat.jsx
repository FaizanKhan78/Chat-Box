import { useInfiniteScrollTop } from "6pp";
import { useTheme } from "@emotion/react";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  Box,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FileMenu from "../components/dialog/FileMenu";
import Messages from "../components/shared/Messages";
import { InputBox } from "../components/styles/StyledComponents";
import { v4 as uuid } from "uuid";
import {
  ALERT,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/event";
import useSocketEvents from "../hooks/useSocketEvents";
import { getToastConfig } from "../lib/features";
import {
  useGetChatDetailsQuery,
  useGetMyFriendDetailsQuery,
  useGetMyMessagesQuery,
} from "../redux/api/api";
import { removeNewMessageAlert } from "../redux/reducers/chat";
import { setIsFileMenu } from "../redux/reducers/misc";
import { getSocket } from "../socket";
import useErrors from "./../hooks/useErrors";
import { FileUploader } from "../components/specific/FileUploader";
import TypingLoader from "./../components/Layout/Loaders/TypingLoader";
import { setFriendProfile } from "../redux/reducers/friendProfile";

const Chat = () => {
  const refContainer = useRef(null);
  const theme = useTheme();
  const fileMenuRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { uploadingLoader } = useSelector((state) => state.misc);
  const { chatID } = useParams();
  const socket = getSocket();
  const dispatch = useDispatch();
  const chatDetails = useGetChatDetailsQuery({
    chatId: chatID,
    skip: !chatID,
  });
  const friendDetails = useGetMyFriendDetailsQuery({ chatId: chatID });
  const [details, setDetails] = useState({
    name: "",
    username: "",
    avatar: "",
    attachments: [],
    members: [],
    groupAdmin: [],
  });

  useEffect(() => {
    let updatedDetails = {
      name: friendDetails.currentData?.details?.name,
      username: friendDetails.currentData?.details?.username,
      avatar: friendDetails.currentData?.details?.avatar,
      groupChat: friendDetails?.currentData?.details?.groupChat || false,
    };
    let attachments = [];
    friendDetails?.currentData?.messages?.filter((message) => {
      if (message.attachments?.length > 0) {
        return attachments.push(message.attachments[0].url);
      }
    });
    updatedDetails = { ...updatedDetails, attachments: attachments };

    if (friendDetails?.currentData?.details?.members) {
      const members = friendDetails?.currentData?.details?.members;
      updatedDetails = { ...updatedDetails, members };
    }

    if (friendDetails?.currentData?.details?.groupAdmin) {
      const groupAdmin = friendDetails?.currentData?.details?.groupAdmin;
      updatedDetails = { ...updatedDetails, groupAdmin };
    }
    // Update the state with the final details object
    setDetails(updatedDetails);

    // Dispatch the action if necessary
  }, [chatID, friendDetails, dispatch]);
  useEffect(() => {
    if (details) {
      // Ensure that this action is only dispatched after `details` is fully set
      dispatch(setFriendProfile(details));
    }
  }, [details, dispatch]);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);

  const [iAmTyping, setIAmTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);
  const bottomRef = useRef(null);

  const oldMessages = useGetMyMessagesQuery({ chatId: chatID, page });
  // console.log(oldMessages.data?.messages);
  const members = chatDetails?.data?.chat?.members;

  const navigate = useNavigate();

  useEffect(() => {
    if (!chatDetails.data?.chat) return navigate("/");
  }, [chatDetails.data, navigate]);

  const newMessagesHandler = useCallback(
    (data) => {
      if (data.chatId !== chatID) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatID]
  );
  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatID) return;
      setUserTyping(true);
    },
    [chatID]
  );
  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatID) return;
      setUserTyping(false);
    },
    [chatID]
  );

  const alertListener = useCallback(
    (content) => {
      const messageForRealTime = {
        content,
        sender: {
          _id: uuid(),
          name: "Admin",
        },
        chat: chatID,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageForRealTime]);
    },
    [chatID]
  );

  const eventHandlers = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesHandler,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandlers);

  const { data, setData } = useInfiniteScrollTop(
    refContainer,
    oldMessages.data?.totalPages,
    page,
    setPage,
    oldMessages.data?.messages
  );

  useEffect(() => {
    dispatch(removeNewMessageAlert(chatID));
    return () => {
      setMessage("");
      setMessages([]);
      setPage(1);
      setData([]);
    };
  }, [chatID, dispatch, setData]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const errors = [
    { isError: chatDetails?.isError, error: chatDetails?.error },
    { isError: oldMessages?.isError, error: oldMessages?.error },
  ];
  useErrors(errors);

  const allMessages = [...data, ...messages];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message", getToastConfig(theme));
      return;
    }
    // Emitting the message to the server
    socket.emit(NEW_MESSAGE, { chatId: chatID, members, message });
    setMessage("");
  };

  const handleFileOpen = () => {
    dispatch(setIsFileMenu(true));
  };

  //* Links ka validation add kar na hai

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (!iAmTyping) {
      socket.emit(START_TYPING, { members, chatId: chatID });
      setIAmTyping(true);
    }
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId: chatID });
      setIAmTyping(false);
    }, [1000]);
  };

  console.log("All Messages", allMessages);

  console.log("Messages", message);

  return chatDetails?.isLoading ? (
    <Skeleton />
  ) : (
    <Stack
      width="100%"
      height="100%" // Ensure the stack takes the full height
      sx={{
        position: "relative",
      }}>
      {/* Message Container */}
      <Stack
        ref={refContainer}
        width="100%"
        height="calc(100% - 64px)" // Adjust height to make room for the input
        sx={{
          overflowY: "auto", // Enable scrolling for messages
          overscrollBehavior: "contain", // Prevent page scroll during overscroll
          padding: "16px", // Add some padding for better UX
        }}>
        {allMessages.map((i) => (
          <Messages key={i._id} message={i} user={user} />
        ))}
        {uploadingLoader && (
          <Box
            component={"div"}
            sx={{
              position: "absolute",
              bottom: "75px",
              width: "100%",
              left: "0",
            }}>
            <FileUploader />
          </Box>
        )}
        {userTyping && <TypingLoader />}
        <div ref={bottomRef} />
      </Stack>
      {/* Input Box Container */}
      <form
        style={{
          position: "absolute", // Keep it fixed at the bottom
          bottom: 0,
          width: "100%",
          backgroundColor: theme.palette.background.paper, // Match background color
          zIndex: 2, // Ensure it stays above the message area
          borderBottom: "3.5px solid aqua",
        }}
        onSubmit={handleSubmit}>
        <Paper elevation={5}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={1}
            padding="8px 16px"
            borderRadius="10px">
            <InputBox
              placeholder="Write Your Message..."
              sx={{
                bgcolor: "text.bgColor",
                color: "text.primary",
                flexGrow: 1,
              }}
              value={message}
              onChange={handleInputChange}
            />

            <Tooltip title="Attachments">
              <IconButton onClick={handleFileOpen}>
                <FontAwesomeIcon icon={faPaperclip} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Send">
              <IconButton
                type="submit"
                sx={{
                  padding: "8px",
                  backgroundColor: "gray",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#666",
                  },
                }}>
                <SendRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>
      </form>
      <FileMenu ref={fileMenuRef} anchorEl={fileMenuRef} chatId={chatID} />
    </Stack>
  );
};

export default Chat;
