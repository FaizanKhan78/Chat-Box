import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Slide from "@mui/material/Slide";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddGroupMember } from "../../redux/reducers/misc";
import useAsyncMutation from "./../../hooks/useAsyncMutation";
import { useAddGroupAdminMutation } from "../../redux/api/api";
import toast from "react-hot-toast";
import { getToastConfig } from "../../lib/features";
import { useTheme } from "@emotion/react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddAdminModal = ({
  chatId,
  groupName,
  groupAdmins,
  members,
  setGroupAdmins,
}) => {
  const { isAddGroupAdmin } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const closeAddGroupAdminModal = () => {
    dispatch(setIsAddGroupMember(false));
  };

  const [selectedUser, setSelectedUser] = React.useState([]);

  const makeUserAdminHandler = (userId) => {
    setSelectedUser((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const [addGroupAdmin, _, data] = useAsyncMutation(useAddGroupAdminMutation);

  React.useEffect(() => {
    if (data) {
      setGroupAdmins(data.updateGroupAdmin);
    }
  }, [data]);

  const remainingMembers = members.filter(
    (member) => !groupAdmins?.some((admin) => admin._id === member._id)
  );

  const theme = useTheme();

  const handleSubmit = async () => {
    if (selectedUser.length === 0) {
      toast.error(
        "No Group Members Selected Please Cancel",
        getToastConfig(theme)
      );
    } else {
      await addGroupAdmin("Adding new Group Admin in ", groupName, {
        members: selectedUser,
        chatId,
      });
      closeAddGroupAdminModal();
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={isAddGroupAdmin}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeAddGroupAdminModal}
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle>
          {"Add Admin in "}
          {groupName}
        </DialogTitle>
        <DialogContent>
          <List sx={{ width: "300px", maxWidth: 500 }}>
            {remainingMembers.length > 0 ? (
              remainingMembers.map((member, i) => (
                <ListItem
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    paddingY: 1,
                    borderBottom: "1px solid #f0f0f0",
                  }}>
                  <ListItemAvatar>
                    <Avatar src={member.avatar} alt={member.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.name}
                    primaryTypographyProps={{
                      fontSize: "1rem",
                      fontWeight: "500",
                      color: "text.primary",
                    }}
                    sx={{ marginLeft: 1 }}
                  />
                  {selectedUser.includes(member._id) ? (
                    <IconButton
                      onClick={() => makeUserAdminHandler(member._id)}
                      edge="end"
                      aria-label="add"
                      sx={{
                        color: "red",
                        "&:hover": { color: "primary.dark" },
                      }}>
                      <RemoveIcon />
                    </IconButton>
                  ) : (
                    <>
                      <IconButton
                        onClick={() => makeUserAdminHandler(member._id)}
                        edge="end"
                        aria-label="add"
                        sx={{
                          color: "primary.main",
                          "&:hover": { color: "primary.dark" },
                        }}>
                        <AddIcon />
                      </IconButton>
                    </>
                  )}
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No members available to add as admin" />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddGroupAdminModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddAdminModal;
