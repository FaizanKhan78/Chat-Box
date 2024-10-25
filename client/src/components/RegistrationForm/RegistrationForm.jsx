import { useTheme } from "@emotion/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import {
  Avatar,
  Box,
  Button,
  FilledInput,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Stack,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab"; // Import LoadingButton
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VisuallyHiddenInput } from "../../components/styles/StyledComponents";
import { server } from "../../constants/config";
import { setAuthenticatedUser } from "../../redux/reducers/auth";
import { SignUpSchema } from "../../utils/validation/validator";
import { getToastConfig } from "./../../lib/features";

const RegistrationForm = ({ setIsLogin }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignUpSchema),
    mode: "onChange",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for the button
  const dispatch = useDispatch();
  const file = watch("avatar");
  const theme = useTheme();

  useEffect(() => {
    if (file && file[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file[0]);
    }
  }, [file]);

  const navigate = useNavigate();

  const handleRegisterSubmit = async (data) => {
    setLoading(true); // Set loading to true when the request starts
    const formData = new FormData();
    formData.append("avatar", data.avatar[0]);
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data: responseData } = await axios.post(
        `${server}/api/v1/user/register`,
        formData,
        config
      );
      dispatch(setAuthenticatedUser(responseData?.user));
      navigate("/");
      toast.success(responseData?.message, getToastConfig(theme));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong",
        getToastConfig(theme)
      );
    } finally {
      setLoading(false); // Set loading to false when the request completes
    }
  };

  return (
    <>
      <Typography
        variant="h5"
        sx={{ marginBottom: 2, color: "text.secondary" }}>
        Sign Up
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(handleRegisterSubmit)}
        sx={{ width: "100%", maxWidth: "400px" }}>
        <Stack position="relative" width="5rem" margin="auto">
          <Avatar
            sx={{
              width: "100%",
              height: "5rem",
              objectFit: "contain",
            }}
            src={imagePreview}
          />
          <IconButton
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "rgba(0,0,0,0.5)",
              ":hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
              color: "text.secondary",
            }}
            component="label">
            <CameraAltIcon />
            <VisuallyHiddenInput type="file" {...register("avatar")} />
          </IconButton>
        </Stack>
        {errors.avatar && (
          <Typography color="error" variant="caption">
            {errors.avatar.message}
          </Typography>
        )}
        <FormControl fullWidth margin="normal" variant="filled">
          <InputLabel htmlFor="username" sx={{ color: "text.secondary" }}>
            Username
          </InputLabel>
          <FilledInput
            id="username"
            autoComplete="username"
            {...register("username")}
            sx={{ color: "text.secondary" }}
          />
          {errors.username && (
            <FormHelperText error>{errors.username.message}</FormHelperText>
          )}
        </FormControl>
        <FormControl fullWidth margin="normal" variant="filled">
          <InputLabel htmlFor="name" sx={{ color: "text.secondary" }}>
            Name
          </InputLabel>
          <FilledInput
            id="name"
            autoComplete="name"
            {...register("name")}
            sx={{ color: "text.secondary" }}
          />
          {errors.name && (
            <FormHelperText error>{errors.name.message}</FormHelperText>
          )}
        </FormControl>
        <FormControl fullWidth margin="normal" variant="filled">
          <InputLabel htmlFor="email" sx={{ color: "text.secondary" }}>
            Email
          </InputLabel>
          <FilledInput
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            sx={{ color: "text.secondary" }}
          />
          {errors.email && (
            <FormHelperText error>{errors.email.message}</FormHelperText>
          )}
        </FormControl>
        <FormControl fullWidth margin="normal" variant="filled">
          <InputLabel htmlFor="password" sx={{ color: "text.secondary" }}>
            Password
          </InputLabel>
          <FilledInput
            id="password"
            type="password"
            autoComplete="password"
            {...register("password")}
            sx={{ color: "text.secondary" }}
          />
          {errors.password && (
            <FormHelperText error>{errors.password.message}</FormHelperText>
          )}
        </FormControl>
        <LoadingButton
          color="primary"
          variant="contained"
          type="submit"
          loading={loading} // Show loading spinner when `loading` is true
          loadingPosition="start"
          startIcon={<PersonIcon />}
          sx={{ marginTop: 3 }}
          fullWidth>
          Register
        </LoadingButton>
        <Typography
          sx={{ marginTop: 2, textAlign: "center", color: "text.secondary" }}>
          Already have an account?
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          sx={{
            marginTop: 1,
            color: "text.secondary",
            borderColor: "text.secondary",
          }}
          onClick={() => setIsLogin(true)}>
          Login
        </Button>
      </Box>
    </>
  );
};

export default RegistrationForm;
