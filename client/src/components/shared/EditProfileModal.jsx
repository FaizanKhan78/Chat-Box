import { useTheme } from "@emotion/react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { EditUserValidatorSchema } from "../../utils/validation/validator";
import { useDispatch } from "react-redux";
import useAsyncMutation from "./../../hooks/useAsyncMutation";
import { useUpdateDetailsMutation } from "../../redux/api/api";
import { setAuthenticatedUser } from "../../redux/reducers/auth";
import { useEffect } from "react";

const EditProfileModal = ({ open, setOpen }) => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EditUserValidatorSchema),
    mode: "onChange",
  });

  const [updateDetails, _, data] = useAsyncMutation(useUpdateDetailsMutation);

  const handleSave = async (data) => {
    // Filter out empty or undefined fields
    const filledData = Object.keys(data).reduce((acc, key) => {
      if (data[key]) {
        acc[key] = data[key]; // Adds key-value pairs only if data[key] is truthy
      }
      return acc;
    }, {}); // The empty object {} is the starting point (accumulator)

    reset();
    // Log the filtered data or send it to the API
    await updateDetails("Details Updated ", " Successfully ", filledData);
    setOpen(false); // Close modal after submission
  };

  useEffect(() => {
    if (data && data.updateUser) {
      dispatch(setAuthenticatedUser(data?.updateUser));
    }
  }, [data, dispatch]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Personal Information</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ marginTop: "10px" }}>
          <TextField
            label="Full Name"
            name="name"
            {...register("name")}
            fullWidth
          />
          {errors?.name && (
            <Typography variant="caption" color="error">
              {errors?.name?.message}
            </Typography>
          )}
          <TextField
            label="Email"
            name="email"
            {...register("email")}
            fullWidth
          />
          {errors?.email && (
            <Typography variant="caption" color="error">
              {errors?.email?.message}
            </Typography>
          )}
          <TextField
            label="Mobile Number"
            name="number"
            {...register("number")}
            fullWidth
          />
          {errors?.number && (
            <Typography variant="caption" color="error">
              {errors?.number?.message}
            </Typography>
          )}
          <Typography sx={{ fontSize: "20px" }}>Bio</Typography>
          <TextareaAutosize
            style={{
              backgroundColor: theme.palette.text.bgColor,
              color: theme.palette.secondary.main, // add this for text color contrast
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            minRows={3}
            placeholder="Type something..."
            name="bio"
            {...register("bio")}
          />
          {errors?.bio && (
            <Typography variant="caption" color="error">
              {errors?.bio?.message}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleSave)}
          variant="contained"
          color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
