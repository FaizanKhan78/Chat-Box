import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import useErrors from "../../hooks/useErrors";
import {
  useAddGroupAdminMutation,
  useGetAvailableFriendsQuery,
} from "../../redux/api/api";
import { setIsAddGroupMember } from "../../redux/reducers/misc";
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  Skeleton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import useAsyncMutation from "../../hooks/useAsyncMutation";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddAdminModal = ({ chatId, groupName, members }) => {
  const { isAddGroupAdmin } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const closeAddGroupAdminModal = () => {
    dispatch(setIsAddGroupMember(false));
  };

  const { isLoading, data, isError, error } =
    useGetAvailableFriendsQuery(chatId);

  const errors = [{ isError, error }];

  const [selectGroupAdmin, setSelectedGroupAdmin] = React.useState([]);

  useErrors(errors);

  let friendsLeft = data?.availableFriends;

  const [allMembers, setAllMembers] = React.useState([]);

  React.useEffect(() => {
    if (!isLoading && data.availableFriends) {
      setAllMembers([...allMembers, ...members, ...friendsLeft]);
    }

    return () => {
      setAllMembers([]);
    };
  }, [isLoading, members, friendsLeft]);

  const handleAddGroupAdmin = (id) => {
    setSelectedGroupAdmin((prev) =>
      prev.includes(id) ? prev.filter((member) => member !== id) : [...prev, id]
    );
  };

  const [addGroupAdmin] = useAsyncMutation(useAddGroupAdminMutation);

  const handleSubmit = () => {
    addGroupAdmin("Adding Group Admin", groupName, {
      chatId,
      members: selectGroupAdmin,
    });
    console.log(selectGroupAdmin);
    // closeAddGroupAdminModal();
  };

  return (
    <React.Fragment>
      <Dialog
        open={isAddGroupAdmin}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeAddGroupAdminModal}
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{"Add Admin"}</DialogTitle>
        <DialogContent>
          <Box id="alert-dialog-slide-description">
            <List sx={{ width: "300px" }}>
              {isLoading ? (
                <ListItem sx={{ display: "block", width: "200px" }}>
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </ListItem>
              ) : (
                <>
                  {allMembers?.length === 0 && (
                    <Typography>No Friends</Typography>
                  )}
                  {allMembers?.map((member, i) => (
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
                          backgroundColor: selectGroupAdmin.includes(member._id)
                            ? "red"
                            : "green",
                        }}
                        onClick={() => handleAddGroupAdmin(member._id)}>
                        {selectGroupAdmin.includes(member._id) ? (
                          <CloseIcon />
                        ) : (
                          <AddIcon />
                        )}
                      </IconButton>
                    </ListItem>
                  ))}
                </>
              )}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddGroupAdminModal}>Disagree</Button>
          <Button onClick={handleSubmit}>Agree</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddAdminModal;
