import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDeleteDialog } from "../../redux/reducers/misc";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmDelete = ({ handleDeleteGroup, groupName }) => {
  const dispatch = useDispatch();
  const { isDeleteDialog } = useSelector((state) => state.misc);
  return (
    <>
      <Dialog
        open={isDeleteDialog}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        onClose={() => dispatch(setIsDeleteDialog(false))}>
        <DialogTitle>{`Are You Sure You Want To Delete "${groupName}"?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Deleting this group will permanently remove all its data, including
            messages, media, and members. This action cannot be undone. Do you
            want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              dispatch(setIsDeleteDialog(false));
            }}>
            Cancel
          </Button>
          <Button color="error" onClick={handleDeleteGroup}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmDelete;
