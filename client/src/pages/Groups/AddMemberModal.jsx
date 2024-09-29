import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import * as React from "react";
import { setIsAddMember } from "../../redux/reducers/misc";
import { useDispatch, useSelector } from "react-redux";
import useAsyncMutation from "../../hooks/useAsyncMutation";
import {
  useAddGroupMembersMutation,
  useGetAvailableFriendsQuery,
} from "../../redux/api/api";
import useErrors from "../../hooks/useErrors";
import AddIcon from "@mui/icons-material/Add";
import {
  List,
  ListItem,
  Skeleton,
  Box,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddMemberModal({ chatId, groupName }) {
  const { isAddMember } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const { isLoading, data, isError, error } =
    useGetAvailableFriendsQuery(chatId);

  const [selectedMembers, setSelectedMembers] = React.useState([]);

  const [addMembers] = useAsyncMutation(useAddGroupMembersMutation);
  const closeAddMemberModal = () => {
    dispatch(setIsAddMember(false));
  };

  const updateMembers = () => {
    addMembers("Adding Members...", groupName, {
      chatId,
      members: selectedMembers,
    });
    dispatch(setIsAddMember(false));
  };

  const errors = [{ isError, error }];
  useErrors(errors);

  const handleAddMembers = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((member) => member !== id) : [...prev, id]
    );
  };

  return (
    <React.Fragment>
      <Dialog
        open={isAddMember}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeAddMemberModal}
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{"Add Members"}</DialogTitle>
        <DialogContent>
          {/* Replace <DialogContentText> with <Box> to avoid nesting issues */}
          <Box id="alert-dialog-slide-description">
            <List sx={{ width: "300px" }}>
              {isLoading ? (
                <ListItem sx={{ display: "block", width: "200px" }}>
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </ListItem>
              ) : <>
                  {data?.availableFriends?.length === 0 && (
                    <Typography>No Friends</Typography>
                  )}
                </> ? (
                data?.availableFriends?.map((member, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      ":hover": "black",
                    }}>
                    {/* Display member details */}
                    <Avatar src={member.avatar} />
                    <Typography sx={{ fontSize: "24px" }}>
                      {member.name}
                    </Typography>
                    <IconButton
                      sx={{
                        // backgroundColor: "#0096c7",
                        backgroundColor: selectedMembers.includes(member._id)
                          ? "red"
                          : "green",
                      }}
                      onClick={() => handleAddMembers(member._id)}>
                      {selectedMembers.includes(member._id) ? (
                        <CloseIcon />
                      ) : (
                        <AddIcon />
                      )}
                    </IconButton>
                  </ListItem>
                ))
              ) : (
                <></>
              )}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddMemberModal}>Disagree</Button>
          <Button onClick={updateMembers} disabled={isLoading}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
