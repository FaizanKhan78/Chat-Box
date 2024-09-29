import { useTheme } from "@emotion/react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  List,
  Slide,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import useAsyncMutation from "../../hooks/useAsyncMutation";
import useErrors from "../../hooks/useErrors";
import { getToastConfig } from "../../lib/features";
import {
  useGetAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import UserItem from "./UserItem";

const NewGroup = ({ isNewGroup, handleNewGroup }) => {
  const [selectedMember, setSelectedMember] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = useState(false);

  const [newGroup, loadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const selectMemberHandler = (id) => {
    setSelectedMember((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const { isError, error, isLoading, data } = useGetAvailableFriendsQuery();
  const errors = [
    {
      isError,
      error,
    },
  ];
  useErrors(errors);

  const theme = useTheme();

  const submitHandler = () => {
    if (!groupName) return handleClick();

    if (selectedMember.length < 2)
      return toast.error("Please Add 3 Members", getToastConfig(theme));
    // console.log(groupName, selectedMember);

    newGroup(`${groupName} Group Created successfully`, "Faizan", {
      name: groupName,
      members: selectedMember,
    });
    handleNewGroup();
  };

  const SlideTransition = (props) => {
    return <Slide {...props} direction="left" />;
  };

  return (
    <>
      <Dialog
        open={isNewGroup}
        onClose={handleNewGroup}
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
          New Group
        </Typography>
        <Box component={"section"} sx={{ display: "flex", gap: "10px" }}>
          {/* Add Group Name Validation */}
          <TextField
            label="Search Name"
            id="outlined-size-small"
            size="small"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{
              width: "100%",
              backgroundColor: "text.bgColor",
              color: "text.secondary",
              borderRadius: "15px",
            }}
            InputProps={{
              style: { borderRadius: "15px" },
            }}
          />
          <Button
            variant="contained"
            sx={{ borderRadius: "10px", fontFamily: "hack", fontSize: "12px" }}
            onClick={submitHandler}
            disabled={loadingNewGroup}>
            Create
          </Button>
        </Box>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            overflowY: "scroll",
          }}>
          {isLoading ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            </>
          ) : data?.friends.length > 0 ? (
            data?.friends.map((user, i) => {
              return (
                <UserItem
                  user={user}
                  key={i}
                  handler={() => selectMemberHandler(user._id)}
                  isAdded={selectedMember.includes(user._id)}
                />
              );
            })
          ) : (
            <Typography>No User Found</Typography>
          )}
        </List>
      </Dialog>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Move this here
        TransitionComponent={SlideTransition} // If you're using a custom transition
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}>
          Enter Group Name
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewGroup;
