import { useTheme } from "@emotion/react";
import { faPeopleGroup, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PersonalDetails from "../../components/specific/PersonalDetails";
import { VisuallyHiddenInput } from "../../components/styles/StyledComponents";
import { getToastConfig } from "../../lib/features";
import {
  clearAuthenticatedUser,
  setAuthenticatedUser,
} from "../../redux/reducers/auth";
import { getAdmin } from "../../redux/thunks/admin";
import AdminModal from "../admin/AdminModal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { server } from "./../../constants/config";
import useAsyncMutation from "../../hooks/useAsyncMutation";
import { useDeleteOrRenameUserAvatarMutation } from "../../redux/api/api";

// Reusable toast configuration

const Setting = () => {
  const { user, isAdmin, adminAccess } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(clearAuthenticatedUser());
      toast.success(data.message, getToastConfig(theme));
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "An error occurred",
        getToastConfig(theme)
      );
    }
  };

  const navigateHandler = () => {
    if (document.startViewTransition()) {
      document.startViewTransition(() => {
        flushSync(() => {
          navigate("/admin");
        });
      });
    } else navigate("/admin");
  };

  const handleIsAdminModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    if (user) {
      setAvatarPreview(user?.avatar.url);
    }
    if (avatar) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(avatar);
    }
  }, [avatar, user]);

  const [userAvatar, _, data] = useAsyncMutation(
    useDeleteOrRenameUserAvatarMutation
  );

  console.log(data);

  useEffect(() => {
    if (data) {
      dispatch(setAuthenticatedUser(data.user));
    }
  }, [data, dispatch]);

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const updatedUserAvatar = new FormData();
      updatedUserAvatar.append("avatar", avatar);
      updatedUserAvatar.append("public_id", user?.avatar?.public_id);
      await userAvatar("Updating ", "Avatar ...", updatedUserAvatar);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAvatar = async () => {
    const deleteUserAvatar = new FormData();
    deleteUserAvatar.append("isDelete", true);
    deleteUserAvatar.append("public_id", user?.avatar?.public_id);
    try {
      await userAvatar("Deleting ", "Avatar ...", deleteUserAvatar);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, []);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        padding: { xs: "1rem", sm: "2rem" }, // Adjust padding for different screen sizes
      }}>
      {/* Main Content */}
      <Grid
        container
        alignItems={"center"}
        sx={{ flexDirection: "column", alignItems: "flex-start" }}>
        <Grid item xs={3}>
          <Avatar
            src={avatarPreview}
            sx={{
              width: { xs: "120px", sm: "150px", md: "200px" }, // Adjust sizes
              height: { xs: "120px", sm: "150px", md: "200px" },
            }}
          />
        </Grid>

        <Grid
          item
          sx={{
            display: "flex",
            alignItems: "flex-start", // Align items to the start
            justifyContent: "center", // Center align for larger screens
            marginLeft: { md: "60px", xs: "0" }, // Adjust margin for smaller screens
            marginTop: { sm: "20px", xs: "30px" },
            flexDirection: { xs: "column-reverse", sm: "row" }, // Change flex direction for small screens
          }}>
          <div>
            <Button
              component="label"
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{
                color: "text.secondary",
                borderRadius: "15px",
                marginBottom: "15px",
                width: { xs: "100%", sm: "fit-content" }, // Full width on small screens
              }}>
              Upload Avatar
              <VisuallyHiddenInput type="file" onChange={handleAvatarChange} />
            </Button>

            <Typography
              sx={{ color: "gray", fontSize: { xs: "0.8rem", sm: "1rem" } }}>
              {" "}
              {/* Responsive typography */}
              At least 800 x 800 is recommended.
              <br />
              JPG or PNG is allowed
            </Typography>
            <Button
              variant="outlined"
              onClick={handleSubmit}
              sx={{ marginTop: { xs: "10px" } }}>
              Submit
            </Button>
          </div>

          <Button
            onClick={handleDeleteAvatar}
            component="label"
            variant="outlined"
            color="error"
            tabIndex={-1}
            startIcon={<DeleteForeverIcon />}
            sx={{
              color: "error",
              borderRadius: "15px",
              marginBottom: { xs: "15px", sm: "0" }, // Adjust margin
              whiteSpace: "nowrap",
              width: { xs: "100%", sm: "fit-content" }, // Full width on small screens
            }}>
            Delete Avatar
          </Button>
        </Grid>
      </Grid>
      <Divider
        sx={{
          marginTop: { xs: "30px", sm: "20px" },
          marginBottom: { xs: "30px", sm: "20px" },
        }}
      />

      <PersonalDetails user={user} />

      <Box
        component={"div"}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack buttons on smaller screens
          justifyContent: "space-between",
          marginTop: { xs: "30px" },
        }}>
        <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
          {" "}
          {/* Full width on small screens */}
          {isAdmin && (
            <>
              {!adminAccess ? (
                <Button
                  variant="outlined"
                  component="label"
                  color="primary"
                  sx={{
                    fontWeight: "550",
                    marginBottom: "20px",
                    width: { xs: "100%", sm: "fit-content" },
                  }} // Full width on small screens
                  onClick={handleIsAdminModal}>
                  <Link
                    component="button"
                    underline="none"
                    style={{ color: "#c800ff", textDecoration: "none" }}>
                    Admin Panel
                  </Link>
                </Button>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  color="primary"
                  sx={{
                    fontWeight: "550",
                    marginBottom: "20px",
                    width: { xs: "100%", sm: "fit-content" },
                  }} // Full width on small screens
                  onClick={navigateHandler}>
                  <Link
                    to="/admin"
                    underline="none"
                    style={{ color: "#c800ff", textDecoration: "none" }}>
                    Go To Panel
                  </Link>
                </Button>
              )}
            </>
          )}
        </Box>

        <Box item sx={{ width: { xs: "100%", sm: "auto" } }}>
          {" "}
          {/* Full width on small screens */}
          <Tooltip title="logout">
            <Button
              component="label"
              variant="outlined"
              color="primary"
              sx={{
                fontWeight: "550",
                marginBottom: "20px",
                width: { xs: "100%", sm: "fit-content" },
              }} // Full width on small screens
              startIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
              onClick={handleLogout}>
              Logout
            </Button>
          </Tooltip>
        </Box>

        <Box item sx={{ width: { xs: "100%", sm: "auto" } }}>
          {" "}
          {/* Full width on small screens */}
          <Link to="/group">
            <Tooltip title="My Groups">
              <Button
                component="label"
                variant="outlined"
                color="primary"
                sx={{
                  fontWeight: "550",
                  marginBottom: "20px",
                  width: { xs: "100%", sm: "fit-content" },
                }} // Full width on small screens
                startIcon={<FontAwesomeIcon icon={faPeopleGroup} />}>
                My Groups
              </Button>
            </Tooltip>
          </Link>
        </Box>
      </Box>
      <AdminModal modal={modal} handleClose={handleIsAdminModal} />
    </Container>
  );
};

export default Setting;
