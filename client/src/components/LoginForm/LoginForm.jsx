import { useTheme } from "@emotion/react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  SwapVerticalCircleOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { server } from "../../constants/config";
import { getToastConfig } from "../../lib/features";
import { setAuthenticatedUser } from "../../redux/reducers/auth";
import { LoginSchema } from "../../utils/validation/validator";
import { LoadingButton } from "@mui/lab";

const LoginForm = ({ setIsLogin }) => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = async (data) => {
    setLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.post(
        `${server}/api/v1/user/login`,
        data,
        config
      );
      dispatch(setAuthenticatedUser(response?.data?.user));
      navigate("/");
      toast.success(response?.data?.message, getToastConfig(theme));
      setLoading(false);
      reset();
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Something went wrong",
        getToastConfig(theme)
      );
    }
  };

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <>
      <Typography
        variant="h5"
        sx={{ marginBottom: 2, color: "text.secondary" }}>
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(handleLoginSubmit)}
        sx={{ width: "100%", maxWidth: "400px" }}>
        {/* Updated Username field with FilledInput */}
        <FormControl fullWidth variant="filled" sx={{ marginBottom: 2 }}>
          <InputLabel
            htmlFor="filled-adornment-username"
            sx={{ color: "text.secondary" }}>
            Username
          </InputLabel>
          <FilledInput
            id="filled-adornment-username"
            {...register("username")}
            sx={{
              color: "text.secondary",
              "& .MuiFilledInput-root": {
                "&:hover fieldset": {
                  borderColor: "text.secondary",
                },
              },
            }}
          />
        </FormControl>
        {errors.username && (
          <Typography color="error" variant="caption">
            {errors.username.message}
          </Typography>
        )}

        {/* Updated password field with visibility toggle */}
        <FormControl fullWidth variant="filled" sx={{ marginTop: 2 }}>
          <InputLabel
            htmlFor="filled-adornment-password"
            sx={{ color: "text.secondary" }}>
            Password
          </InputLabel>
          <FilledInput
            id="filled-adornment-password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            sx={{
              color: "text.secondary",
              "& .MuiFilledInput-root": {
                "&:hover fieldset": {
                  borderColor: "text.secondary",
                },
              },
            }}
          />
        </FormControl>
        {errors.password && (
          <Typography color="error" variant="caption">
            {errors.password.message}
          </Typography>
        )}

        {loading ? (
          <LoadingButton
            sx={{
              width: "100%",
              marginTop: 3,
            }}
            loading
            loadingPosition="center"
            startIcon={<SwapVerticalCircleOutlined />}
            variant="outlined">
            Save
          </LoadingButton>
        ) : (
          <Button
            color="primary"
            variant="contained"
            type="submit"
            sx={{ marginTop: 3 }}
            fullWidth>
            Login
          </Button>
        )}
        <Typography
          sx={{ marginTop: 2, textAlign: "center", color: "text.secondary" }}>
          Don&apos;t have an account?
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          disabled={loading}
          sx={{
            marginTop: 1,
            color: "text.secondary",
            borderColor: "text.secondary",
          }}
          onClick={() => setIsLogin(false)}>
          Sign Up
        </Button>
      </Box>
    </>
  );
};

export default LoginForm;
