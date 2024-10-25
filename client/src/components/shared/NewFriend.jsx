import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  List,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useAsyncMutation from "../../hooks/useAsyncMutation";
import {
  useLazySearchUsersQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import UserItem from "./UserItem";

const NewFriend = ({ isSearch, handleNewFriend }) => {
  const [setFriendRequest, isLoading] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const addFriendHandler = async (id, name) => {
    await setFriendRequest("Sending Friend Request", name, { userId: id });
  };

  //* After Practical Move Search to react-form-hook
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(6);
  const [searchUsers] = useLazySearchUsersQuery("");
  const [loading, setLoading] = useState(true);

  const handleAddUsers = () => {
    setShowUsers((prev) => prev + 6);
  };

  const handleRemoveUsers = () => {
    setShowUsers(6);
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUsers(searchText)
        .then(({ data }) => {
          setUsers(data.users);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [searchText, searchUsers]);

  return (
    <>
      <Dialog
        open={isSearch}
        onClose={handleNewFriend}
        fullWidth
        maxWidth="sm" // Controls the max width of the dialog
        PaperProps={{
          sx: {
            padding: "20px", // Adds some padding around the content
            borderRadius: "15px", // Adds rounded corners
            backgroundImage: "none",
          },
        }}>
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "22px",
            fontFamily: "hack",
            letterSpacing: "-1px",
            padding: "0px 0px 20px 0px",
          }}>
          Search Friend
        </Typography>
        <Box component={"section"} sx={{ display: "flex", gap: "10px" }}>
          <TextField
            name="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            label="Search"
            id="outlined-controlled"
            size="small"
            sx={{
              width: "100%",
              backgroundColor: "text.bgColor",
              borderRadius: "15px",
              color: "text.primary",
            }}
            InputProps={{
              style: { borderRadius: "15px" },
            }}
          />
          <Button
            variant="contained"
            sx={{ borderRadius: "10px", fontFamily: "hack", fontSize: "12px" }}>
            Search
          </Button>
        </Box>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            overflowY: "scroll",
          }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : users.length > 0 ? (
            <>
              {users.slice(0, showUsers).map((user) => (
                <UserItem
                  user={user}
                  key={user._id}
                  handler={addFriendHandler}
                  handlerIsLoading={isLoading}
                />
              ))}
              <Button
                onClick={
                  searchText.length === 0 && showUsers >= users.length
                    ? handleRemoveUsers
                    : handleAddUsers
                }
                sx={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  cursor: "pointer",
                  width: "100%",
                  marginTop: "10px",
                  color: "#5d4fab",
                  ":active": {
                    color: "#3c4d9e",
                  },
                }}>
                {" "}
                {searchText.length === 0 && showUsers >= users.length
                  ? "View Less"
                  : "View More"}
              </Button>
            </>
          ) : (
            <p>No users found.</p>
          )}
        </List>
      </Dialog>
    </>
  );
};

export default NewFriend;
